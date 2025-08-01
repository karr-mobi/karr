import { foreignKey, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { accountsTable } from "./accounts"
import { specialStatusTable } from "./specialstatus"
import { userPrefsTable } from "./userprefs"

export const profileTable = pgTable(
    "Profile",
    {
        id: uuid().primaryKey().defaultRandom(),
        firstName: text().notNull(),
        lastName: text().notNull(),
        nickname: text(),
        phone: text().unique(),
        bio: text(),
        avatar: text(),
        prefs: uuid()
            .notNull()
            .references(() => userPrefsTable.id),
        accountProvider: text().notNull(),
        accountRemoteId: text().notNull(),
        specialStatus: text().references(() => specialStatusTable.title)
    },
    (table) => [
        foreignKey({
            columns: [table.accountProvider, table.accountRemoteId],
            foreignColumns: [accountsTable.provider, accountsTable.remoteId],
            name: "profile_account_fk"
        })
    ]
)

export const profileSelectSchema = createSelectSchema(profileTable)
export const profileInsertSchema = createInsertSchema(profileTable)
