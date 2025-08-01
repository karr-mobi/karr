import { getClient } from "@karr/auth/client"
import { subjects } from "@karr/auth/subjects"
import {
    InvalidAccessTokenError,
    InvalidRefreshTokenError
} from "@openauthjs/openauth/error"
import { setTokens } from "@/app/auth/actions"
import type { Cookies } from "./types"

/**
 * Check if the user is authenticated
 * @param ctx The request context
 * @returns true if the user is authenticated
 */
export async function isAuthenticated(cookies: Cookies) {
    const accessToken = cookies.get("access_token")
    const refreshToken = cookies.get("refresh_token")

    const client = await getClient()

    if (!accessToken) {
        return false
    }

    const verified = await client.verify(subjects, accessToken.value, {
        refresh: refreshToken?.value
    })

    if (verified.err) {
        if (
            verified.err instanceof InvalidAccessTokenError ||
            verified.err instanceof InvalidRefreshTokenError
        ) {
            console.log("Invalid tokens")
            cookies.delete("access_token")
            cookies.delete("refresh_token")
        } else {
            console.error("Unexpected error:", verified.err)
        }

        return false
    }

    if (verified.tokens) {
        setTokens(verified.tokens)
    }

    return verified.subject.properties
}
