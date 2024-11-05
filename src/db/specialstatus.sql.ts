import { pgTable, text, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const specialStatusTable = pgTable("SpecialStatus", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    title: text().notNull().unique(),
    description: text(),
})
