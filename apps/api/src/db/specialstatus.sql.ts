import { pgTable, text, uuid } from "drizzle-orm/pg-core"

export const specialStatusTable = pgTable("SpecialStatus", {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull().unique(),
    description: text()
})
