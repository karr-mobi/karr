import type { UserProperties } from "@karr/auth/subjects"
import { AUTH_PROVIDERS } from "@karr/config"
import logger from "@karr/logger"
import { tryCatch } from "@karr/util"
import { err, ok } from "neverthrow"
import { db } from "@/db"
import { accountsTable } from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import { userPrefsTable } from "@/db/schemas/userprefs"
import type { Providers } from "../providers"

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
    const prefs = await db
        .insert(userPrefsTable)
        .values({})
        .returning({ id: userPrefsTable.id })

    if (prefs.length === 0 || !prefs[0]) {
        logger.error("Failed to create user preferences")
        return err("Failed to create user preferences")
    }

    const profile = await db
        .insert(profileTable)
        .values({
            firstName: data.firstName,
            lastName: data.lastName,
            avatar: data.avatar,
            prefs: prefs[0].id
        })
        .returning({
            id: profileTable.id,
            firstName: profileTable.firstName,
            lastName: profileTable.lastName,
            nickname: profileTable.nickname,
            avatar: profileTable.avatar
        })

    if (profile.length === 0 || !profile[0]) {
        logger.error("Failed to create profile")
        return err("Failed to create profile")
    }

    const account = await tryCatch(
        db
            .insert(accountsTable)
            .values({
                provider: data.provider,
                remoteId: data.remoteId,
                email: data.email,
                profile: profile[0].id,
                verified: isTrustedProvider(data.provider)
                    ? data.verified
                    : false
            })
            .returning()
    )

    if (!account.success || account.value.length === 0 || !account.value[0]) {
        logger.error("Failed to create account")
        return err("Failed to create account")
    }

    return ok({
        id: profile[0].id,
        firstName: profile[0].firstName,
        lastName: profile[0].lastName,
        nickname: profile[0].nickname,
        avatar: profile[0].avatar
    } satisfies UserProperties)
}
