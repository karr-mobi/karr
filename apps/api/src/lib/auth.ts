import { eq } from "drizzle-orm"
import type { Context } from "hono"
import { getCookie, deleteCookie } from "hono/cookie"
import { err, ok } from "neverthrow"

import db from "@karr/db"
import { accountsTable } from "@karr/db/schemas/accounts.js"
import { tryCatch } from "@karr/util/trycatch"
import { subjects } from "@karr/auth/subjects"
import { setTokens } from "@/routes/auth/issuer"
import { client } from "./auth-client"

/**
 * Check if the user is authenticated
 * @param ctx The request context
 * @returns true if the user is authenticated
 */
export async function isAuthenticated(ctx: Context) {
    const accessToken = getCookie(ctx, "access_token")
    const refreshToken = getCookie(ctx, "refresh_token")

    if (!accessToken) {
        return false
    }

    const verified = await client.verify(subjects, accessToken, {
        refresh: refreshToken
    })

    if (verified.err) {
        console.error("Error verifying token:", verified.err)
        deleteCookie(ctx, "access_token")
        deleteCookie(ctx, "refresh_token")
        return false
    }
    if (verified.tokens) {
        setTokens(ctx, verified.tokens)
    }

    return verified.subject
}

/**
 * Get the account ID for a given token
 * @param token The user's token
 * @returns the account ID
 */
export async function getAccount(token: string) {
    const account = await tryCatch(
        db
            .select({
                id: accountsTable.id
            })
            .from(accountsTable)
            .where(eq(accountsTable.id, token))
            .limit(1)
    )

    if (
        account.error ||
        account.value.length === 0 ||
        account.value[0] === undefined
    ) {
        return err("Invalid authorization token")
    }

    return ok(account.value[0].id)
}
