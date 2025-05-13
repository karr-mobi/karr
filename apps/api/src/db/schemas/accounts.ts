import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { profileTable } from "./profile"

export const accountsTable = pgTable("Accounts", {
    id: uuid().primaryKey().defaultRandom(),
    provider: text().notNull(),
    remoteId: text(),
    email: text().unique().notNull(),
    blocked: boolean().default(false),
    verified: boolean().default(false),
    profile: uuid()
        .notNull()
        .references(() => profileTable.id)
})

export const accountsSelectSchema = createSelectSchema(accountsTable)

export const accountsInsertSchema = createInsertSchema(accountsTable)
