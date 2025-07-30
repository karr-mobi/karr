import logger from "@karr/logger"
import { tryCatch } from "@karr/util"
import { eq, sql } from "drizzle-orm"
import { err, ok } from "neverthrow"
import { z } from "zod/v4-mini"
import drizzle from "@/api/db"
import { accountsTable } from "@/api/db/schemas/accounts"
import { profileTable } from "@/api/db/schemas/profile"
import { specialStatusTable } from "@/api/db/schemas/specialstatus"
import { TripSchema, tripsTable, tripsView } from "@/api/db/schemas/trips"
import { userPrefsTable } from "@/api/db/schemas/userprefs"

/**
 * Select a user by their ID
 * @param id The ID of the user to select. Assumes uuid v4 format.
 * @returns The user with the given ID
 */
export async function selectUserById(id: string) {
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
                email: accountsTable.email,
                verified: accountsTable.verified,
                autoBook: userPrefsTable.autoBook,
                defaultPlaces: userPrefsTable.defaultPlaces,
                smoke: userPrefsTable.smoke,
                music: userPrefsTable.music,
                pets: userPrefsTable.pets
            })
            .from(profileTable)
            .where(eq(profileTable.id, id))
            .innerJoin(
                accountsTable,
                eq(profileTable.id, accountsTable.profile)
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

export async function updateNickname(id: string, nickname: string) {
    logger.debug(`Updating nickname for user ${id} to ${nickname}`)
    const { success, error } = await tryCatch(
        drizzle
            .update(profileTable)
            .set({ nickname })
            .where(eq(profileTable.id, id))
    )
    if (!success) {
        logger.error(`Failed to update nickname for user ${id}: ${error}`)
        return false
    }
    return true
}

export async function updateBio(id: string, bio: string) {
    logger.debug(`Updating bio for user ${id} to ${bio}`)
    const { success, error } = await tryCatch(
        drizzle.update(profileTable).set({ bio }).where(eq(profileTable.id, id))
    )
    if (!success) {
        logger.error(`Failed to update bio for user ${id}: ${error}`)
        return false
    }
    return true
}

export async function updateAvatar(id: string, avatar: string | null) {
    logger.debug(`Updating avatar for user ${id}`)
    const { success, error } = await tryCatch(
        drizzle
            .update(profileTable)
            .set({ avatar })
            .where(eq(profileTable.id, id))
    )
    if (!success) {
        logger.error(`Failed to update avatar for user ${id}: ${error}`)
        return false
    }
    return true
}

export async function selectUserTrips(id: string) {
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
            .where(eq(tripsView.driver, id))
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
                tripsCount: sql<number>`(
                    SELECT COUNT(*)::int
                    FROM ${tripsTable}
                    WHERE ${tripsTable.driver} = ${id}
                )`,
                createdAt: accountsTable.createdAt
            })
            .from(profileTable)
            .where(eq(profileTable.id, id))
            .leftJoin(accountsTable, eq(profileTable.id, accountsTable.profile))
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
