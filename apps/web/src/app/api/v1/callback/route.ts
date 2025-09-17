import { CALLBACK_URL, client } from "@karr/auth/client"
import { subjects } from "@karr/auth/subjects"
import { APP_URL } from "@karr/config"
import logger from "@karr/logger"
import type {
    ExchangeError,
    ExchangeSuccess
} from "@openauthjs/openauth/client"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { runtime } from "std-env"
import { setTokens } from "@/app/auth/actions"
import { saveUser } from "./persistence"

export async function GET(request: Request) {
    /**
     * Convenience function to redirect to the login error page with an error message.
     */
    function errorRedirect(
        error: string,
        status = 302,
        errorDescription?: string | null
    ) {
        const redirectUrl = new URL(`/fr-FR/login/error`, APP_URL)
        redirectUrl.searchParams.set("error", error)
        if (errorDescription)
            redirectUrl.searchParams.set("error_description", errorDescription)
        logger.debug(`Redirecting to ${redirectUrl.href}`)

        return NextResponse.redirect(redirectUrl.href, status)
    }

    // Collect the details of the auth flow result
    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const error = url.searchParams.get("error")
    const errorDescription = url.searchParams.get("error_description")
    const next = url.searchParams.get("next") ?? `${APP_URL}/`

    logger.debug(`AUTH CALLBACK: URL ${url}`)

    // Redirect to error page if there is an error
    if (error) {
        logger.debug(`[${runtime}] AUTH CALLBACK: Error in request - ${error}`)

        return errorRedirect(error, 302, errorDescription)
    }

    // Redirect to error page if there code is missing
    if (!code) {
        return errorRedirect("Missing code", 302)
    }

    // Attempt to exchange the code for tokens
    let exchanged: ExchangeSuccess | ExchangeError
    try {
        exchanged = await client.exchange(code, CALLBACK_URL)
    } catch (error) {
        console.error(
            `[${runtime}] AUTH CALLBACK: Exception during code exchange:`,
            error
        )
        return errorRedirect("Token exchange failed", 302)
    }

    // If the exchange was unsuccessful, redirect to error page
    if (exchanged.err) {
        logger.debug(
            `[${runtime}] AUTH CALLBACK: Error exchanging code`,
            exchanged.err
        )
        return errorRedirect(exchanged.err.message, 302)
    }

    // Verify the tokens to get the user subject
    const user = await client.verify(subjects, exchanged.tokens.access)

    if (user.err) {
        logger.debug(
            `[${runtime}] AUTH CALLBACK: Error verifying user`,
            user.err
        )
        return errorRedirect(user.err.message, 302)
    }

    // Save user to db, create if user doesn't exist
    const savedUser = await saveUser(user.subject.properties)

    if (savedUser.isErr()) {
        // If user exists and is blocked, redirect to error page, don't save tokens
        if (savedUser.error === "Account is blocked") {
            logger.debug(
                `[${runtime}] AUTH CALLBACK: Account is blocked`,
                savedUser.error
            )
            return errorRedirect("Account is blocked", 302)
        }

        // Redirect to error page for any other error
        logger.debug(
            `[${runtime}] AUTH CALLBACK: Error saving user`,
            savedUser.error
        )
        return errorRedirect(savedUser.error, 302)
    }

    logger.debug(`[${runtime}] AUTH CALLBACK: User saved: ${savedUser.value}`)

    // Save tokens to cookie
    setTokens(exchanged.tokens, await cookies())

    logger.debug(`[${runtime}] AUTH CALLBACK: Redirecting to: ${next}`)

    return NextResponse.redirect(next)
}
