import type { Context } from "hono"
import { getCookie, deleteCookie } from "hono/cookie"

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
