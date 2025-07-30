import { eq } from "drizzle-orm"
import { date, integer, pgTable, pgView, text, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { profileTable } from "./profile"

export const tripsTable = pgTable("Trips", {
    id: uuid().primaryKey().defaultRandom(),
    from: text().notNull(),
    to: text().notNull(),
    departure: date().notNull(),
    price: integer().notNull(),
    createdAt: date().defaultNow(),
    updatedAt: date().defaultNow(),
    driver: uuid()
        .references(() => profileTable.id)
        .notNull()
})

export const tripsView = pgView("trips_view").as((qb) => {
    return qb
        .select({
            id: tripsTable.id,
            from: tripsTable.from,
            to: tripsTable.to,
            departure: tripsTable.departure,
            price: tripsTable.price,
            driver: tripsTable.driver,
            firstName: profileTable.firstName,
            lastName: profileTable.lastName,
            nickname: profileTable.nickname,
            avatar: profileTable.avatar
        })
        .from(tripsTable)
        .leftJoin(profileTable, eq(tripsTable.driver, profileTable.id))
})

export const TripSchema = createSelectSchema(tripsView)

export const NewTripSchema = createInsertSchema(tripsTable)

export const NewTripInputSchema = NewTripSchema.pick({
    from: true,
    to: true
})
    .extend({
        departure: z.union([z.date(), z.iso.datetime()]),
        price: z.number().min(0)
    })
    .transform((data) => ({
        ...data,
        departure: new Date(data.departure).toISOString()
    }))

export type Trip = z.infer<typeof TripSchema> & { origin?: string }
export type NewTrip = z.infer<typeof NewTripSchema>
export type NewTripInput = z.infer<typeof NewTripInputSchema>
