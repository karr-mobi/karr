import {
    boolean,
    pgTable,
    primaryKey,
    text,
    timestamp,
    unique
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod/mini"

export const accountsTable = pgTable(
    "Accounts",
    {
        provider: text().notNull(),
        remoteId: text().notNull(),
        email: text().notNull(),
        blocked: boolean().default(false),
        verified: boolean().default(false),
        role: text({ enum: ["user", "admin"] })
            .default("user")
            .notNull(),
        createdAt: timestamp().defaultNow().notNull()
    },
    (table) => [
        primaryKey({ columns: [table.provider, table.remoteId] }),
        unique().on(table.provider, table.email)
    ]
)

export const accountsSelectSchema = createSelectSchema(accountsTable)

export const AccountIdSchema = accountsSelectSchema.pick({
    provider: true,
    remoteId: true
})

export type AccountId = z.infer<typeof AccountIdSchema>

export const accountsInsertSchema = createInsertSchema(accountsTable)
