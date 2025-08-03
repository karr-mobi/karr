import logger from "@karr/logger"
import { tryCatch } from "@karr/util"
import { and, eq, sql } from "drizzle-orm"
import { err, ok } from "neverthrow"
import { z } from "zod/v4-mini"
import drizzle from "@/db"
import { type AccountId, accountsTable } from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import {
    type NewTripInput,
    NewTripSchema,
    TripSchema,
    tripsTable,
    tripsView
} from "@/db/schemas/trips"
import { userPrefsTable } from "@/db/schemas/userprefs"

export async function getTrips() {
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
    )

    if (!trips.success) {
        logger.error("failed to get from trips view", trips.error)
        return err("Failed to get trips from db")
    }

    logger.debug("Trips fetched successfully", trips.value)

    const t = z.safeParse(TripSchema.array(), trips.value)
    if (!t.success) {
        logger.debug("Failed to parse trips:", t.error)
        return err("Failed to parse trips")
    }

    return ok(t.data)
}

export async function getTripDetails(tripId: string) {
    const trip = await tryCatch(
        drizzle
            .select({
                id: tripsTable.id,
                from: tripsTable.from,
                to: tripsTable.to,
                departure: tripsTable.departure,
                price: tripsTable.price,
                places: userPrefsTable.defaultPlaces,
                driver: {
                    id: profileTable.id,
                    firstName: profileTable.firstName,
                    lastName: profileTable.lastName,
                    nickname: profileTable.nickname,
                    avatar: profileTable.avatar,
                    verified: accountsTable.verified,
                    accountProvider: accountsTable.provider,
                    accountRemoteId: accountsTable.remoteId
                },
                preferences: {
                    autoBook: userPrefsTable.autoBook,
                    music: userPrefsTable.music,
                    smoke: userPrefsTable.smoke,
                    pets: userPrefsTable.pets
                }
            })
            .from(tripsTable)
            .where(eq(tripsTable.id, tripId))
            .leftJoin(profileTable, eq(tripsTable.driver, profileTable.id))
            .leftJoin(
                accountsTable,
                and(
                    eq(accountsTable.provider, profileTable.accountProvider),
                    eq(accountsTable.remoteId, profileTable.accountRemoteId)
                )
            )
            .leftJoin(userPrefsTable, eq(profileTable.prefs, userPrefsTable.id))
    )

    if (!trip.success) {
        logger.error("Error connecting to db", trip.error)
        return err("Failed to query db")
    }

    if (trip.value.length === 0 || !trip.value[0]) {
        return err("Trip not found")
    }

    return ok(trip.value[0])
}

export async function getTrip(tripId: string) {
    const { success, value, error } = await tryCatch(
        drizzle
            .select()
            .from(tripsTable)
            .innerJoin(profileTable, eq(tripsTable.driver, profileTable.id))
            .where(eq(tripsTable.id, tripId))
    )

    if (!success) {
        logger.error("Error connecting to db", error)
        return err("Failed to query db")
    }

    if (value.length === 0 || !value[0]) {
        return err("Trip not found")
    }

    return ok(value[0])
}

export async function getUserTrips(userId: string) {
    const trips = await drizzle
        .select()
        .from(tripsTable)
        .where(eq(tripsTable.driver, userId))

    const u = TripSchema.array().safeParse(trips)
    if (!u.success) {
        logger.debug("Failed to parse user trips:", u.error)
        return err("Failed to parse user trips")
    }

    return ok(u.data)
}

export async function addTrip(trip: NewTripInput, account: AccountId) {
    const [user] = await drizzle
        .select()
        .from(profileTable)
        .where(
            and(
                eq(profileTable.accountProvider, account.provider),
                eq(profileTable.accountRemoteId, account.remoteId)
            )
        )

    if (!user) {
        logger.debug("Profile not found:", account)
        return err("Profile not found")
    }

    const t = NewTripSchema.safeParse({
        ...trip,
        driver: user.id
    })

    if (!t.success) {
        logger.debug("Failed to parse trip:", t.error)
        return err("Failed to parse trip")
    }

    const [inserted] = await drizzle
        .insert(tripsTable)
        .values(t.data)
        .returning({ id: tripsTable.id })

    if (!inserted) {
        logger.debug("Failed to insert trip:", inserted)
        return err("Failed to insert trip")
    }

    const InsertedTripSchema = z.object({
        id: z.uuid()
    })

    const insertedTrip = InsertedTripSchema.safeParse(inserted)

    if (!insertedTrip.success) {
        logger.debug("Failed to parse inserted trip:", insertedTrip.error)
        return err("Failed to parse inserted trip")
    }

    return ok(insertedTrip.data)
}

export async function deleteTrip(
    tripId: string,
    userId: string
): Promise<boolean> {
    const res = await tryCatch(
        drizzle
            .delete(tripsTable)
            .where(
                and(eq(tripsTable.id, tripId), eq(tripsTable.driver, userId))
            )
            .returning({ deletedId: tripsTable.id })
    )

    return res.success && !!res.value[0]?.deletedId
}
