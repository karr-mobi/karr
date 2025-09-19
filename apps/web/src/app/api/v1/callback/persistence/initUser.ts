import {
    APP_URL,
    APPLICATION_NAME,
    AUTH_PROVIDERS,
    SUPPORT_EMAIL
} from "@karr/config"
import logger from "@karr/logger"
import { sendEmail } from "@karr/mail"
import { WelcomeTemplate } from "@karr/mail/templates/welcome"
import { lazy, tryCatch } from "@karr/util"
import { and, count, eq } from "drizzle-orm"
import { err, ok } from "neverthrow"
import { db } from "@/db"
import { accountsTable } from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import { userPrefsTable } from "@/db/schemas/userprefs"

type Providers =
    | Exclude<(typeof AUTH_PROVIDERS)[number]["name"], "password" | "code">
    | "local"

export type UserInitData = {
    firstName: string
    lastName: string
    avatar?: string | undefined
    email: string
    verified?: boolean
    provider: Providers
    remoteId: string
}

export function isTrustedProvider(provider: Providers) {
    return !!AUTH_PROVIDERS.find((p) => p.name === provider)?.trusted
}

// Check if there are users on the instance
export const isFirstUser = lazy(async (): Promise<boolean> => {
    const [number] = await db.select({ count: count() }).from(accountsTable)
    return number?.count === 1
})

/**
 * Initializes a new user in the database by creating user preferences, profile, and account.
 * @param data The user data to initialize
 * @returns The user properties if successful, or an error message
 */
export async function initUser(data: UserInitData) {
    const [prefs] = await db
        .insert(userPrefsTable)
        .values({})
        .returning({ id: userPrefsTable.id })

    if (!prefs) {
        logger.error("Failed to create user preferences")
        return err("Failed to create user preferences")
    }

    const [account] = await db
        .insert(accountsTable)
        .values({
            provider: data.provider,
            remoteId: data.remoteId,
            email: data.email,
            verified: isTrustedProvider(data.provider) ? data.verified : false
        })
        .returning()

    if (!account) {
        logger.error("Failed to create account")
        return err("Failed to create account")
    }

    const [profile] = await db
        .insert(profileTable)
        .values({
            firstName: data.firstName,
            lastName: data.lastName,
            avatar: data.avatar,
            prefs: prefs.id,
            accountRemoteId: data.remoteId,
            accountProvider: data.provider
        })
        .returning({
            id: profileTable.id,
            firstName: profileTable.firstName,
            lastName: profileTable.lastName,
            nickname: profileTable.nickname,
            avatar: profileTable.avatar
        })

    if (!profile) {
        logger.error("Failed to create profile")
        return err("Failed to create profile")
    }

    // if user is the first of the instance, make them admin
    if (await isFirstUser.value) {
        logger.debug("Instance is fresh, setting user as admin")

        const account = await db
            .update(accountsTable)
            .set({ role: "admin" })
            .where(
                and(
                    eq(accountsTable.provider, data.provider),
                    eq(accountsTable.email, data.email)
                )
            )
            .returning({ id: accountsTable.role })

        if (!account) {
            logger.error("Failed to make first user admin")
            return err("Failed to make first user admin")
        }

        // avoid re-querying the instance state
        isFirstUser.override(Promise.resolve(false))
    }

    const email = await tryCatch(
        sendEmail({
            to: data.email,
            subject: `Welcome to ${APPLICATION_NAME}!`,
            template: WelcomeTemplate({
                APPLICATION_NAME,
                APP_URL,
                SUPPORT_EMAIL,
                name: `${data.firstName} ${data.lastName}`
            })
        })
    )

    if (!email.success) {
        logger.error("Failed to send welcome email")
        return err("Failed to send welcome email")
    }

    return ok()
}
