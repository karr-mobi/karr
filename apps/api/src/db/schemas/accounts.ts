import { boolean, pgTable, text, unique, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { profileTable } from "./profile"

export const accountsTable = pgTable(
    "Accounts",
    {
        id: uuid().primaryKey().defaultRandom(),
        remoteId: text(),
        provider: text().notNull(),
        email: text().notNull(),
        blocked: boolean().default(false),
        verified: boolean().default(false),
        profile: uuid()
            .notNull()
            .references(() => profileTable.id)
    },
    (t) => [unique().on(t.provider, t.email)]
)

export const accountsSelectSchema = createSelectSchema(accountsTable)

export const accountsInsertSchema = createInsertSchema(accountsTable)
