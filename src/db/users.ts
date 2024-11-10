import drizzle from "../lib/db_conn.ts"
import { usersTable } from "../db/users.sql.ts"
import { eq } from "drizzle-orm"
import { userPrefsTable } from "./userprefs.sql.ts"
import type { UserWithPrefsAndStatus } from "../lib/types.d.ts"
import { specialStatusTable } from "./specialstatus.sql.ts"

export const selectAllUsers = async () => {
    return await drizzle.select().from(usersTable)
}

/**
 * Select a user by their ID
 * @param id The ID of the user to select. !! ID HAS TO BE UUID v4.
 * @returns The user with the given ID
 */
export const selectUserById = async (id: string): Promise<UserWithPrefsAndStatus> => {
    const users = await drizzle
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .leftJoin(userPrefsTable, eq(usersTable.prefs, userPrefsTable.id))
        .leftJoin(specialStatusTable, eq(usersTable.specialStatus, specialStatusTable.id))
    return <UserWithPrefsAndStatus> users[0]
}
