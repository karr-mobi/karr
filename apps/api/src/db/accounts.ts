import { eq } from "drizzle-orm"

import { accountsTable } from "~/db/schemas/accounts"
import drizzle from "~/lib/db_conn"
import type { AccountVerified } from "~/lib/types.d.ts"

/**
 * Change an account's email address
 * @param id The ID of the account to update. Assumes uuid v4 format.
 * @param email The new email address
 * @returns Whether the update was successful
 */
export async function updateEmail(id: string, email: string): Promise<boolean> {
    await drizzle.update(accountsTable).set({ email }).where(eq(accountsTable.id, id))
    return true
}

/**
 * Check if a user is verified
 * @param id The ID of the account to check. Assumes uuid v4 format.
 * @returns Whether the user is verified
 */
export async function isVerified(id: string): Promise<AccountVerified> {
    const accounts = await drizzle
        .select({
            verified: accountsTable.verified
        })
        .from(accountsTable)
        .where(eq(accountsTable.user, id))
        .limit(1)
    return {
        verified: accounts[0]?.verified === true
    }
}
