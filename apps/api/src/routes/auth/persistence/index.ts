import { ok, err } from "neverthrow"

import logger from "@karr/logger"
import { UserProperties } from "@karr/auth/subjects"
import { db } from "@/db"
import { accountsTable } from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import { userPrefsTable } from "@/db/schemas/userprefs"

import { type ProfileData } from "../profile-fetchers"
import { Providers } from "../providers"
import { AUTH_PROVIDERS } from "@karr/config"
import { findOrCreateUserFromGithub } from "./github"
import { findOrCreateUserFromLocalAuth } from "./local"
import { findOrCreateUserFromGoogle } from "./google"

type UserInitData = {
    firstName: string
    lastName: string
    avatar?: string | undefined
    email: string
    provider: Providers
    remoteId: string
}

function isTrustedProvider(provider: Providers) {
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

    const account = await db
        .insert(accountsTable)
        .values({
            provider: data.provider,
            remoteId: data.remoteId,
            email: data.email,
            profile: profile[0].id,
            verified: isTrustedProvider(data.provider)
        })
        .returning()

    if (account.length === 0 || !account[0]) {
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

/**
 * Checks if a user exists in the database based on the provided profile data.
 * If the user does not exist, it creates a new user and returns the user properties.
 * @param data The profile data to check or insert
 * @returns The user properties if the user exists or was created, or an error message
 */
export async function getOrInsertUser(data: ProfileData) {
    logger.debug(data)

    if (data.provider === "password" || data.provider === "code") {
        return findOrCreateUserFromLocalAuth(data)
    } else if (data.provider === "github") {
        return findOrCreateUserFromGithub(data)
    } else if (data.provider === "google") {
        return findOrCreateUserFromGoogle(data)
    }

    // Should never happen
    logger.debug(`Unknown provider: ${data.provider}`)
    return err("Invalid provider")
}
