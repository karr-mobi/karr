import { boolean, integer, pgTable, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod/mini"

export const userPrefsTable = pgTable("UserPrefs", {
    id: uuid().primaryKey().defaultRandom(),
    autoBook: boolean().default(true),
    defaultPlaces: integer().default(3),
    smoke: boolean().default(false),
    music: boolean().default(true),
    pets: boolean().default(false)
})

export const UserPrefsSelectSchema = createSelectSchema(userPrefsTable)
export const UserPrefsInsertSchema = createInsertSchema(userPrefsTable)

export const UserPrefsSchema = UserPrefsInsertSchema.pick({
    autoBook: true,
    defaultPlaces: true,
    smoke: true,
    music: true,
    pets: true
})
export type UserPrefs = z.infer<typeof UserPrefsSchema>
