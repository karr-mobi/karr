import { eq } from "drizzle-orm"
import { z } from "zod"

import drizzle from "@karr/db"
import {
    NewTripSchema,
    TripSchema,
    tripsTable,
    type NewTrip,
    type Trip
} from "@karr/db/schemas/trips.js"
import logger from "@karr/util/logger"

export async function getTrips(): Promise<Trip[]> {
    const trips = await drizzle.select().from(tripsTable)
    return TripSchema.array().parse(trips)
}

export async function getUserTrips(userId: string): Promise<Trip[]> {
    const trips = await drizzle
        .select()
        .from(tripsTable)
        .where(eq(tripsTable.account, userId))
    return TripSchema.array().parse(trips)
}

export async function addTrip(trip: NewTrip): Promise<{ id: string }> {
    const t = NewTripSchema.parse(trip)
    const inserted = await drizzle
        .insert(tripsTable)
        .values(t)
        .returning({ id: tripsTable.id })

    if (!inserted || inserted.length === 0 || !inserted[0]) {
        logger.debug("Failed to insert trip:", inserted)
        throw new Error("Failed to insert trip")
    }

    const InsertedTripSchema = z.object({
        id: z.string().uuid()
    })

    return InsertedTripSchema.parse(inserted[0])
}
