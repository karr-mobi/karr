import { pgTable, text, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { specialStatusTable } from "./specialstatus"
import { userPrefsTable } from "./userprefs"

export const profileTable = pgTable("Profile", {
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
    specialStatus: text().references(() => specialStatusTable.title)
})

export const profileSelectSchema = createSelectSchema(profileTable)
export const profileInsertSchema = createInsertSchema(profileTable)
