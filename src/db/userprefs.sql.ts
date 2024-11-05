import { boolean, integer, pgTable, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const userPrefsTable = pgTable("UserPrefs", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    autoBook: boolean().default(sql`true`),
    defaultPlaces: integer(),
    smoke: boolean().default(sql`false`),
    music: boolean().default(sql`true`),
    pets: boolean().default(sql`false`),
})
