import { ok, err } from "neverthrow"
import { eq, and } from "drizzle-orm"

import logger from "@karr/logger"
import { UserProperties } from "@karr/auth/subjects"
import { db } from "@/db"
import { accountsTable } from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import { userPrefsTable } from "@/db/schemas/userprefs"

import { type ProfileData, isOAuth2ProfileData } from "./profile-fetchers"
import { Providers } from "./providers"
import { AUTH_PROVIDERS } from "@karr/config"

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
async function initUser(data: UserInitData) {
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
        id: account[0].id,
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

    if (data.provider === "password") {
        // Check if user exists
        const user = await db
            .select()
            .from(accountsTable)
            .where(
                and(
                    eq(accountsTable.provider, data.provider),
                    eq(accountsTable.email, data.email)
                )
            )
            .innerJoin(profileTable, eq(accountsTable.profile, profileTable.id))

        if (user.length > 0 && user[0]) {
            // The user exists

            if (user[0].Accounts.blocked) {
                return err("Account is blocked")
            }

            if (!user[0].Accounts.verified) {
                return err("Email not verified")
            }

            return ok({
                id: user[0].Profile.id,
                firstName: user[0].Profile.firstName,
                lastName: user[0].Profile.lastName,
                nickname: user[0].Profile.nickname,
                avatar: user[0].Profile.avatar
            } satisfies UserProperties)
        } else if (user.length === 0) {
            // the user does not exist

            // create it and return the new user data
            const name = data.email.split("@")[0]
            const newUser = await initUser({
                firstName: name ?? "",
                lastName: "",
                avatar: "https://profiles.cache.lol/finxol/picture?v=1743626159",
                email: data.email,
                provider: data.provider,
                remoteId: data.email
            })

            if (newUser.isErr()) {
                logger.error("Failed to create user", newUser.error)
                return err("Failed to create user")
            }

            return ok(newUser.value satisfies UserProperties)
        }

        return err("Unknown error")
    } else if (data.provider === "code") {
        const user = await db
            .select()
            .from(accountsTable)
            .where(
                and(
                    eq(accountsTable.provider, data.provider),
                    eq(accountsTable.email, data.email)
                )
            )
            .innerJoin(profileTable, eq(accountsTable.profile, profileTable.id))

        if (user.length > 0 && user[0]) {
            // The user exists

            if (user[0].Accounts.blocked) {
                return err("Account is blocked")
            }

            if (!user[0].Accounts.verified) {
                return err("Email not verified")
            }

            return ok({
                id: user[0].Profile.id,
                firstName: user[0].Profile.firstName,
                lastName: user[0].Profile.lastName,
                nickname: user[0].Profile.nickname,
                avatar: user[0].Profile.avatar
            } satisfies UserProperties)
        } else if (user.length === 0) {
            // the user does not exist

            // create it and return the new user data
            const name = data.email.split("@")[0]
            const newUser = await initUser({
                firstName: name ?? "",
                lastName: "",
                email: data.email,
                provider: data.provider,
                remoteId: data.email
            })

            if (newUser.isErr()) {
                logger.error("Failed to create user", newUser.error)
                return err("Failed to create user")
            }

            return ok(newUser.value satisfies UserProperties)
        }

        // Check if user exists

        // if user exists, check if the email is verified and account is not blocked
        // if not, return an error, else return the user data

        // if user does not exist, create it and return the new user data

        return err("Unknown error")
    } else if (isOAuth2ProfileData(data)) {
        // Check if user exists
        const user = await db
            .select()
            .from(accountsTable)
            .where(
                and(
                    eq(accountsTable.provider, data.provider),
                    eq(accountsTable.remoteId, data.remoteId)
                )
            )
            .innerJoin(profileTable, eq(accountsTable.profile, profileTable.id))

        if (user.length > 0 && user[0]) {
            // The user exists

            if (user[0].Accounts.blocked) {
                return err("Account is blocked")
            }

            // update the user avatar if it is different
            let avatar = data.avatar
            if (user[0].Profile.avatar !== data.avatar) {
                const a = await db
                    .update(profileTable)
                    .set({ avatar: data.avatar })
                    .where(eq(profileTable.id, user[0].Profile.id))
                    .returning({
                        avatar: profileTable.avatar
                    })

                if (a.length === 0 || !a[0]) {
                    logger.error("Failed to update avatar")
                    return err("Failed to update avatar")
                }

                avatar = a[0].avatar ?? undefined
            }

            return ok({
                id: user[0].Profile.id,
                firstName: user[0].Profile.firstName,
                lastName: user[0].Profile.lastName,
                nickname: user[0].Profile.nickname,
                avatar: avatar
            } satisfies UserProperties)
        } else if (user.length === 0) {
            // the user does not exist

            // if user does not exist, create it and return the new user data
            const [firstName, ...lastName] = data.name.split(" ")
            const newUser = await initUser({
                firstName: firstName ?? "",
                lastName: lastName.join(" "),
                avatar: data.avatar,
                email: data.email,
                provider: data.provider,
                remoteId: data.remoteId
            })

            if (newUser.isErr()) {
                logger.error("Failed to create user", newUser.error)
                return err("Failed to create user")
            }

            return ok(newUser.value satisfies UserProperties)
        }

        return err("Unknown error")
    }

    // Should never happen
    logger.debug("Unknown provider", data.provider)
    return err("Invalid provider")
}
