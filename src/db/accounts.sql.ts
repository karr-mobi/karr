import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { usersTable } from "./users.sql.ts"

export const accountsTable = pgTable("Accounts", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    email: text().unique().notNull(),
    blocked: boolean().default(sql`false`),
    verified: boolean().default(sql`false`),
    user: uuid().notNull().references(() => usersTable.id),
})
