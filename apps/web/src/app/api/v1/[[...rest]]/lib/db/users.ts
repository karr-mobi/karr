import logger from "@karr/logger"
import { tryCatch } from "@karr/util"
import { and, eq, sql } from "drizzle-orm"
import { err, ok } from "neverthrow"
import { z } from "zod/mini"
import drizzle from "@/db"
import { type AccountId, accountsTable } from "@/db/schemas/accounts"
import { type EditProfile, profileTable } from "@/db/schemas/profile"
import { specialStatusTable } from "@/db/schemas/specialstatus"
import { TripSchema, tripsTable, tripsView } from "@/db/schemas/trips"
import { type UserPrefs, userPrefsTable } from "@/db/schemas/userprefs"

/**
 * Select a user by their ID
 * @param id The ID of the user to select. Assumes uuid v4 format.
 * @returns The user with the given ID
 */
export async function selectUserByAccountId(id: AccountId) {
    logger.debug(`Selecting user by ID: ${id}`)

    const users = await tryCatch(
        drizzle
            .select({
                id: profileTable.id,
                firstName: profileTable.firstName,
                nickname: profileTable.nickname,
                lastName: profileTable.lastName,
                phone: profileTable.phone,
                bio: profileTable.bio,
                avatar: profileTable.avatar,
                provider: accountsTable.provider,
                remoteId: accountsTable.remoteId,
                email: accountsTable.email,
                verified: accountsTable.verified,
                autoBook: userPrefsTable.autoBook,
                defaultPlaces: userPrefsTable.defaultPlaces,
                smoke: userPrefsTable.smoke,
                music: userPrefsTable.music,
                pets: userPrefsTable.pets
            })
            .from(profileTable)
            .where(
                and(
                    eq(accountsTable.provider, id.provider),
                    eq(accountsTable.remoteId, id.remoteId)
                )
            )
            .innerJoin(
                accountsTable,
                and(
                    eq(accountsTable.provider, profileTable.accountProvider),
                    eq(accountsTable.remoteId, profileTable.accountRemoteId)
                )
            )
            .leftJoin(userPrefsTable, eq(profileTable.prefs, userPrefsTable.id))
            .leftJoin(
                specialStatusTable,
                eq(profileTable.specialStatus, specialStatusTable.title)
            )
            .limit(1)
    )

    if (!users.success) {
        logger.error(`Failed to get user ${id}: ${users.error}`)
        return err("Failed to get user")
    }

    return ok(users.value[0])
}

export async function updateProfile(id: AccountId, data: EditProfile) {
    logger.debug(`Updating profile for user ${id} to ${data.nickname}`)
    const { success, error } = await tryCatch(
        drizzle
            .update(profileTable)
            .set(data)
            .where(
                and(
                    eq(profileTable.accountProvider, id.provider),
                    eq(profileTable.accountRemoteId, id.remoteId)
                )
            )
    )
    if (!success) {
        logger.error(`Failed to update profile for user ${id}: ${error}`)
        return false
    }
    return true
}

export async function updateNickname(id: AccountId, nickname: string) {
    logger.debug(`Updating nickname for user ${id} to ${nickname}`)
    const { success, error } = await tryCatch(
        drizzle
            .update(profileTable)
            .set({ nickname })
            .where(
                and(
                    eq(profileTable.accountProvider, id.provider),
                    eq(profileTable.accountRemoteId, id.remoteId)
                )
            )
    )
    if (!success) {
        logger.error(`Failed to update nickname for user ${id}: ${error}`)
        return false
    }
    return true
}

export async function updateBio(id: AccountId, bio: string) {
    logger.debug(`Updating bio for user ${id} to ${bio}`)
    const { success, error } = await tryCatch(
        drizzle
            .update(profileTable)
            .set({ bio })
            .where(
                and(
                    eq(profileTable.accountProvider, id.provider),
                    eq(profileTable.accountRemoteId, id.remoteId)
                )
            )
    )
    if (!success) {
        logger.error(`Failed to update bio for user ${id}: ${error}`)
        return false
    }
    return true
}

export async function updateAvatar(id: AccountId, avatar: string | null) {
    logger.debug(`Updating avatar for user ${id}`)
    const { success, error } = await tryCatch(
        drizzle
            .update(profileTable)
            .set({ avatar })
            .where(
                and(
                    eq(profileTable.accountProvider, id.provider),
                    eq(profileTable.accountRemoteId, id.remoteId)
                )
            )
    )
    if (!success) {
        logger.error(`Failed to update avatar for user ${id}: ${error}`)
        return false
    }
    return true
}

export async function updateUserPrefs(id: AccountId, userPrefs: UserPrefs) {
    logger.debug(`Updating avatar for user ${id}`)

    const user = await tryCatch(
        drizzle
            .select({ prefs: profileTable.prefs })
            .from(profileTable)
            .where(
                and(
                    eq(profileTable.accountProvider, id.provider),
                    eq(profileTable.accountRemoteId, id.remoteId)
                )
            )
    )

    if (!user.success) {
        logger.error(`Failed to fetch user ${id}: ${user.error}`)
        return false
    }

    if (user.value.length === 0 || !user.value[0]) {
        logger.error(`User ${id} not found`)
        return false
    }

    const { success, error } = await tryCatch(
        drizzle
            .update(userPrefsTable)
            .set(userPrefs)
            .where(eq(userPrefsTable.id, user.value[0].prefs))
    )
    if (!success) {
        logger.error(`Failed to update avatar for user ${id}: ${error}`)
        return false
    }
    return true
}

export async function selectUserTrips(id: AccountId) {
    const trips = await tryCatch(
        drizzle
            .select({
                id: tripsView.id,
                from: tripsView.from,
                to: tripsView.to,
                departure: tripsView.departure,
                price: tripsView.price,
                driver: tripsView.driver,
                firstName: sql`"trips_view"."firstName"`,
                lastName: sql`"trips_view"."lastName"`,
                nickname: sql`"trips_view"."nickname"`,
                avatar: sql`"trips_view"."avatar"`
            })
            .from(tripsView)
            .where(
                and(
                    eq(sql`"trips_view"."accountProvider"`, id.provider),
                    eq(sql`"trips_view"."accountRemoteId"`, id.remoteId)
                )
            )
    )

    if (!trips.success) {
        logger.error("failed to get from trips view", trips.error)
        return err("Failed to get trips from db")
    }

    const t = z.safeParse(TripSchema.array(), trips.value)
    if (!t.success) {
        logger.debug("Failed to parse trips:", t.error)
        return err("Failed to parse trips")
    }

    return ok(t.data)
}

export async function selectUserProfileById(id: string) {
    const users = await tryCatch(
        drizzle
            .select({
                firstName: profileTable.firstName,
                lastName: profileTable.lastName,
                nickname: profileTable.nickname,
                avatar: profileTable.avatar,
                bio: profileTable.bio,
                specialStatus: profileTable.specialStatus,
                autoBook: userPrefsTable.autoBook,
                defaultPlaces: userPrefsTable.defaultPlaces,
                smoke: userPrefsTable.smoke,
                music: userPrefsTable.music,
                pets: userPrefsTable.pets,
                tripsCount: sql<number>`(
                    SELECT COUNT(*)::int
                    FROM ${tripsTable}
                    WHERE ${tripsTable.driver} = ${id}
                )`,
                createdAt: accountsTable.createdAt
            })
            .from(profileTable)
            .where(eq(profileTable.id, id))
            .leftJoin(
                accountsTable,
                and(
                    eq(accountsTable.provider, profileTable.accountProvider),
                    eq(accountsTable.remoteId, profileTable.accountRemoteId)
                )
            )
            .leftJoin(userPrefsTable, eq(userPrefsTable.id, profileTable.prefs))
            .limit(1)
    )

    if (!users.success) {
        logger.error(
            `Failed to get user profile for user ${id}: ${users.error}`
        )
        return err("Failed to get user profile")
    }

    return ok(users.value[0])
}
