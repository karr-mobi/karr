import { boolean, integer, pgTable, uuid } from "drizzle-orm/pg-core"

export const userPrefsTable = pgTable("UserPrefs", {
    id: uuid().primaryKey().defaultRandom(),
    autoBook: boolean().default(true),
    defaultPlaces: integer(),
    smoke: boolean().default(false),
    music: boolean().default(true),
    pets: boolean().default(false),
})
