import { eq } from "drizzle-orm"
import { err, ok } from "neverthrow"

import drizzle from "@karr/db"
import { accountsTable } from "@karr/db/schemas/accounts.js"
import { profileTable } from "@karr/db/schemas/profile.js"
import { tryCatch } from "@karr/util/trycatch"
import logger from "@karr/logger"

import type { UserWithPrefsAndStatus as _UserWithPrefsAndStatus } from "@/lib/types.d.ts"

/**
 * Select a user by their ID
 * @param id The ID of the user to select. Assumes uuid v4 format.
 * @returns The user with the given ID
 */
export async function selectUserById(id: string) {
    // TODO: move back to Users table, not Accounts!!
    const users = await tryCatch(
        drizzle
            .select({
                id: accountsTable.id,
                email: accountsTable.email,
                blocked: accountsTable.blocked,
                verified: accountsTable.verified
            })
            .from(accountsTable)
            .where(eq(accountsTable.id, id))
            // .leftJoin(userPrefsTable, eq(usersTable.prefs, userPrefsTable.id))
            // .leftJoin(
            //     specialStatusTable,
            //     eq(usersTable.specialStatus, specialStatusTable.title)
            // )
            .limit(1)
    )

    if (!users.success) {
        logger.error(`Failed to get user ${id}: ${users.error}`)
        return err("Failed to get user")
    }

    return ok(users.value[0])
}

export async function updateNickname(id: string, nickname: string) {
    logger.debug(`Updating nickname for user ${id} to ${nickname}`)
    const { success, error } = await tryCatch(
        drizzle
            .update(profileTable)
            .set({ nickname })
            .where(eq(profileTable.id, id))
    )
    if (!success) {
        logger.error(`Failed to update nickname for user ${id}: ${error}`)
        return false
    }
    return true
}

export async function selectUserProfileById(id: string) {
    const users = await tryCatch(
        drizzle
            .select({
                firstName: profileTable.firstName,
                nickname: profileTable.nickname,
                bio: profileTable.bio,
                specialStatus: profileTable.specialStatus
            })
            .from(profileTable)
            .where(eq(profileTable.id, id))
            .limit(1)
    )

    if (!users.success) {
        logger.error(
            `Failed to get user profile for user ${id}: ${users.error}`
        )
        return err("Failed to get user profile")
    }

    return ok(users.value[0])
}
