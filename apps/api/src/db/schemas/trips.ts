import { date, integer, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { z } from "zod"

import { profileTable } from "./profile"

export const tripsTable = pgTable("Trips", {
    id: uuid().primaryKey().defaultRandom(),
    from: text().notNull(),
    to: text().notNull(),
    departure: date().notNull(),
    price: integer().notNull(),
    createdAt: date().defaultNow(),
    updatedAt: date().defaultNow(),
    account: uuid()
        .references(() => profileTable.id)
        .notNull()
})

export const TripSchema = z.object({
    id: z.string().uuid(),
    origin: z.string().optional().nullable(),
    from: z.string(),
    to: z.string(),
    departure: z.string(),
    price: z.number().min(0),
    createdAt: z.string().optional().nullable(),
    updatedAt: z.string().optional().nullable(),
    account: z.string().uuid(),
    nickname: z.string().email().nullable().optional(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable().optional()
})

export type Trip = z.infer<typeof TripSchema>

export const NewTripSchema = z.object({
    from: z.string(),
    to: z.string(),
    departure: z.string(),
    price: z.number().min(0),
    account: z.string().uuid()
})

export type NewTrip = z.infer<typeof NewTripSchema>

export const NewTripInputSchema = z.object({
    from: z.string().min(1),
    to: z.string().min(1),
    departure: z.date(),
    price: z.number().min(0)
})

export type NewTripInput = z.infer<typeof NewTripInputSchema>
