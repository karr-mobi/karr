import { pgTable, text, uuid } from "drizzle-orm/pg-core"
import { userPrefsTable } from "./userprefs.sql.ts"
import { specialStatusTable } from "./specialstatus.sql.ts"

export const usersTable = pgTable("Users", {
    id: uuid().primaryKey().defaultRandom(),
    firstName: text().notNull(),
    lastName: text().notNull(),
    nickname: text(),
    phone: text().unique(),
    bio: text(),
    prefs: uuid().notNull().references(() => userPrefsTable.id),
    specialStatus: text().references(() => specialStatusTable.title),
})
