import { subjects } from "@karr/auth/subjects"
import logger from "@karr/logger"
import type { Context } from "hono"
import { deleteCookie, getCookie } from "hono/cookie"
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
        logger.error("Error verifying token:", verified.err)
        deleteCookie(ctx, "access_token")
        deleteCookie(ctx, "refresh_token")
        return false
    }
    if (verified.tokens) {
        setTokens(ctx, verified.tokens)
    }

    return verified.subject
}
