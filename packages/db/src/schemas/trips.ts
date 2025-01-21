import { date, integer, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { z } from "zod"

import { accountsTable } from "./accounts"

export const tripsTable = pgTable("Trips", {
    id: uuid().primaryKey().defaultRandom(),
    from: text().notNull(),
    to: text().notNull(),
    departure: date().notNull(),
    price: integer().notNull(),
    createdAt: date().defaultNow(),
    updatedAt: date().defaultNow(),
    account: uuid()
        // .notNull()
        .references(() => accountsTable.id)
})

export const TripSchema = z.object({
    id: z.string().uuid(),
    from: z.string(),
    to: z.string(),
    departure: z.string(),
    price: z.number(),
    createdAt: z.string().optional().nullable(),
    updatedAt: z.string().optional().nullable(),
    account: z.any().optional()
})

export type Trip = z.infer<typeof TripSchema>
