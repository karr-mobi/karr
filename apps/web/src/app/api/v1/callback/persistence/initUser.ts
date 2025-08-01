import { AUTH_PROVIDERS } from "@karr/config"
import logger from "@karr/logger"
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

    return ok()
}
