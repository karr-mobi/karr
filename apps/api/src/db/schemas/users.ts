import { pgTable, text, uuid } from "drizzle-orm/pg-core"

import { specialStatusTable } from "./specialstatus"
import { userPrefsTable } from "./userprefs"

export const usersTable = pgTable("Users", {
    id: uuid().primaryKey().defaultRandom(),
    firstName: text().notNull(),
    lastName: text().notNull(),
    nickname: text(),
    phone: text().unique(),
    bio: text(),
    prefs: uuid()
        .notNull()
        .references(() => userPrefsTable.id),
    specialStatus: text().references(() => specialStatusTable.title)
})
