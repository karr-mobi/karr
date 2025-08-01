import { tryCatch } from "@karr/util"
import { and, eq } from "drizzle-orm"
import drizzle from "@/db"
import { type AccountId, accountsTable } from "@/db/schemas/accounts"

/**
 * Change an account's email address
 * @param id The ID of the account to update. Assumes uuid v4 format.
 * @param email The new email address
 * @returns Whether the update was successful
 */
export async function updateEmail(id: AccountId, email: string) {
    const { success } = await tryCatch(
        drizzle
            .update(accountsTable)
            .set({ email })
            .where(
                and(
                    eq(accountsTable.provider, id.provider),
                    eq(accountsTable.remoteId, id.remoteId)
                )
            )
    )

    if (!success) {
        return false
    }

    return true
}

/**
 * Check if a user is verified
 * @param id The ID of the account to check. Assumes uuid v4 format.
 * @returns Whether the user is verified
 */
export async function isVerified(id: AccountId) {
    const accounts = await tryCatch(
        drizzle
            .select({
                verified: accountsTable.verified
            })
            .from(accountsTable)
            .where(
                and(
                    eq(accountsTable.provider, id.provider),
                    eq(accountsTable.remoteId, id.remoteId)
                )
            )
            .limit(1)
    )

    if (!accounts.success) {
        return {
            verified: false
        }
    }

    return {
        verified: accounts.value[0]?.verified === true
    }
}
