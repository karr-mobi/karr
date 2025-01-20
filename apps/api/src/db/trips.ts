import { eq } from "drizzle-orm"

import drizzle from "@karr/db"
import { TripSchema, tripsTable, type Trip } from "@karr/db/schemas/trips.js"

export const getTrips = async (): Promise<Trip[]> => {
    const trips = await drizzle.select().from(tripsTable)
    return TripSchema.array().parse(trips)
}

export const getUserTrips = async (userId: string): Promise<Trip[]> => {
    const trips = await drizzle
        .select()
        .from(tripsTable)
        .where(eq(tripsTable.account, userId))
    return TripSchema.array().parse(trips)
}
