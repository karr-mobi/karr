import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core"

import { usersTable } from "./users.sql.js"

export const accountsTable = pgTable("Accounts", {
    id: uuid().primaryKey().defaultRandom(),
    email: text().unique().notNull(),
    blocked: boolean().default(false),
    verified: boolean().default(false),
    user: uuid()
        .notNull()
        .references(() => usersTable.id)
})
