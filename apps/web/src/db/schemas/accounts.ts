import {
    boolean,
    pgTable,
    primaryKey,
    text,
    timestamp,
    unique
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod/v4-mini"

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

export type AccountId = Pick<
    z.infer<typeof accountsSelectSchema>,
    "provider" | "remoteId"
>

export const accountsInsertSchema = createInsertSchema(accountsTable)
