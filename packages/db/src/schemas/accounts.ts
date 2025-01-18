import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core"

import { usersTable } from "./users"

export const accountsTable = pgTable("Accounts", {
    id: uuid().primaryKey().defaultRandom(),
    email: text().unique().notNull(),
    password: text().notNull(),
    token: text(),
    blocked: boolean().default(false),
    verified: boolean().default(false),
    user: uuid()
        // .notNull()
        .references(() => usersTable.id)
})
