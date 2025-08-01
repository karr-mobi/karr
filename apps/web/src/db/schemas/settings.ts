import { date, pgTable, uuid } from "drizzle-orm/pg-core"

export const settingsTable = pgTable("Settings", {
    id: uuid().primaryKey().defaultRandom(),
    inserted_at: date().defaultNow()
})
