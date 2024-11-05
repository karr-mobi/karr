import { pgTable, text, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { userPrefsTable } from "./userprefs.sql.ts"
import { specialStatusTable } from "./specialstatus.sql.ts"

export const usersTable = pgTable("Users", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    name: text().notNull(),
    nickname: text(),
    phone: text().unique(),
    bio: text(),
    prefs: uuid().notNull().references(() => userPrefsTable.id),
    specialStatus: uuid().references(() => specialStatusTable.id),
})
