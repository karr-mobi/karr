import logger from "@karr/logger"
import { tryCatch } from "@karr/util"
import { eq } from "drizzle-orm"
import { err, ok } from "neverthrow"
import drizzle from "@/db"
import { accountsTable } from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import { specialStatusTable } from "@/db/schemas/specialstatus"
import { userPrefsTable } from "@/db/schemas/userprefs"

/**
 * Select a user by their ID
 * @param id The ID of the user to select. Assumes uuid v4 format.
 * @returns The user with the given ID
 */
export async function selectUserById(id: string) {
    logger.debug(`Selecting user by ID: ${id}`)

    const users = await tryCatch(
        drizzle
            .select({
                id: profileTable.id,
                firstName: profileTable.firstName,
                nickname: profileTable.nickname,
                lastName: profileTable.lastName,
                phone: profileTable.phone,
                bio: profileTable.bio,
                provider: accountsTable.provider,
                email: accountsTable.email,
                verified: accountsTable.verified,
                autoBook: userPrefsTable.autoBook,
                defaultPlaces: userPrefsTable.defaultPlaces,
                smoke: userPrefsTable.smoke,
                music: userPrefsTable.music,
                pets: userPrefsTable.pets
            })
            .from(profileTable)
            .where(eq(profileTable.id, id))
            .innerJoin(
                accountsTable,
                eq(profileTable.id, accountsTable.profile)
            )
            .leftJoin(userPrefsTable, eq(profileTable.prefs, userPrefsTable.id))
            .leftJoin(
                specialStatusTable,
                eq(profileTable.specialStatus, specialStatusTable.title)
            )
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
