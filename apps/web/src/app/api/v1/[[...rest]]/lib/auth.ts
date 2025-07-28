import { getClient } from "@karr/auth/client"
import { subjects } from "@karr/auth/subjects"
import type { cookies } from "next/headers"
import { setTokens } from "@/app/auth/actions"

type Cookies = Awaited<ReturnType<typeof cookies>>

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
        console.log("Invalid token:", verified.err)
        cookies.delete("access_token")
        cookies.delete("refresh_token")
        return false
    }

    if (verified.tokens) {
        setTokens(verified.tokens)
    }

    return verified.subject.properties
}
