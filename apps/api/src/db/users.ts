import { eq } from "drizzle-orm"

import drizzle from "@karr/db/conn"
import { specialStatusTable } from "@karr/db/schemas/specialstatus.js"
import { userPrefsTable } from "@karr/db/schemas/userprefs.js"
import { usersTable } from "@karr/db/schemas/users.js"
import logger from "@karr/util/logger"

import type { UserPublicProfile, UserWithPrefsAndStatus } from "@/lib/types.d.ts"

/**
 * Select a user by their ID
 * @param id The ID of the user to select. Assumes uuid v4 format.
 * @returns The user with the given ID
 */
export async function selectUserById(id: string): Promise<UserWithPrefsAndStatus> {
    const users = await drizzle
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .leftJoin(userPrefsTable, eq(usersTable.prefs, userPrefsTable.id))
        .leftJoin(
            specialStatusTable,
            eq(usersTable.specialStatus, specialStatusTable.title)
        )
        .limit(1)
    return <UserWithPrefsAndStatus>users[0]
}

export async function updateNickname(id: string, nickname: string): Promise<boolean> {
    logger.debug(`Updating nickname for user ${id} to ${nickname}`)
    await drizzle.update(usersTable).set({ nickname }).where(eq(usersTable.id, id))
    return Promise.resolve(true)
}

export async function selectUserProfileById(id: string): Promise<UserPublicProfile> {
    const users = await drizzle
        .select({
            firstName: usersTable.firstName,
            nickname: usersTable.nickname,
            bio: usersTable.bio,
            specialStatus: usersTable.specialStatus
        })
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1)
    return <UserPublicProfile>users[0]
}
