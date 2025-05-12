import { issuer } from "@openauthjs/openauth"
import { Select } from "@openauthjs/openauth/ui/select"
import type { Theme } from "@openauthjs/openauth/ui/theme"
import type { Tokens } from "@openauthjs/openauth/client"
import { setCookie } from "hono/cookie"
import type { Context } from "hono"
import { runtime } from "std-env"

import { subjects, UserProperties } from "@karr/auth/subjects"
import { authBaseUrl } from "@karr/auth/client"
import { API_BASE } from "@karr/config"
import { logger } from "@karr/logger"

import { callbackUrl, client } from "@/lib/auth-client"

import { UnStorage } from "./unstorage-adapter"
import { providers } from "./providers"
import type { SuccessValues } from "./sucess"
import { getGithubUserData } from "./profile-fetchers/github"
import { getGoogleUserData } from "./profile-fetchers/google"
import { getOrInsertUser } from "./persistence"
import { Result } from "neverthrow"
import { ErrorResponse } from "@/lib/types"
import { getDriver } from "./drivers"

const driver = await getDriver()

const theme: Theme = {
    title: "Karr Auth",
    logo: "/logo-tmp.jpg",
    background: {
        dark: "hsl(132 2% 10%)",
        light: "hsl(140 20% 97%)"
    },
    primary: {
        dark: "hsl(132 74% 32%)",
        light: "hsl(132 64% 32%)"
    },
    font: {
        family: "Varela Round, sans-serif"
    },
    css: `
        html {
            --border-radius: 2.8 !important;
        }
    `
}

const app = issuer({
    basePath: authBaseUrl(API_BASE),
    select: Select({}),
    providers,
    storage: UnStorage({
        driver
    }),
    subjects,
    theme,
    async allow(input, _req) {
        return input.redirectURI === callbackUrl && input.clientID === "karr"
    },
    async success(ctx, value: SuccessValues) {
        logger.debug(
            `[${runtime}] auth success handler called with provider: ${value.provider}`
        )
        let subjectData: Result<UserProperties, string>
        if (value.provider === "password") {
            logger.debug(
                `[${runtime}] Getting/inserting password provider user`
            )
            subjectData = await getOrInsertUser({
                provider: value.provider,
                email: value.email
            })
        } else if (value.provider === "code") {
            logger.debug(`[${runtime}] Getting/inserting code provider user`)
            subjectData = await getOrInsertUser({
                provider: value.provider,
                email: value.claims.email
            })
        } else if (value.provider === "github") {
            logger.debug(`[${runtime}] Getting GitHub user data`)
            // get the user data from github
            const userData = await getGithubUserData(value.tokenset.access)

            if (userData.isErr()) {
                logger.error(
                    `[${runtime}] Error getting GitHub user data: ${userData.error}`
                )
                throw new Error(userData.error)
            }

            logger.debug(`[${runtime}] Getting/inserting GitHub provider user`)
            // save the user data to the database, and return the jwt payload
            subjectData = await getOrInsertUser(userData.value)
        } else if (value.provider === "google") {
            logger.debug(`[${runtime}] Getting Google user data`)
            // extract the user data
            const userData = await getGoogleUserData(value.id)

            logger.debug(`[${runtime}] Getting/inserting Google provider user`)
            // save the user data to the database, and return the jwt payload
            subjectData = await getOrInsertUser(userData.value)
        } else {
            // should never happen
            logger.debug(`[${runtime}] Unknown provider`, value)
            throw new Error("Invalid provider")
        }

        if (subjectData.isErr()) {
            logger.error(
                `[${runtime}] Error creating subject data: ${subjectData.error}`
            )
            throw new Error(subjectData.error)
        }

        logger.debug(`[${runtime}] Success handler returning subject`)
        return ctx.subject("user", subjectData.value)
    }
})

app.get("/callback", async (ctx) => {
    logger.debug(`[${runtime}] AUTH CALLBACK: processing callback request`)
    const url = new URL(ctx.req.url)
    const code = ctx.req.query("code")
    const error = ctx.req.query("error")
    const next = ctx.req.query("next") ?? `${url.origin}/`

    if (error) {
        logger.debug(`[${runtime}] AUTH CALLBACK: Error in request - ${error}`)
        return ctx.json(
            {
                message: error,
                cause: ctx.req.query("error_description")
            } satisfies ErrorResponse,
            500
        )
    }

    if (!code) {
        logger.debug(`[${runtime}] AUTH CALLBACK: Missing code parameter`)
        return ctx.json(
            {
                message: "Missing code"
            } satisfies ErrorResponse,
            400
        )
    }

    logger.debug(`[${runtime}] AUTH CALLBACK: Exchanging code for tokens`)
    let exchanged
    try {
        exchanged = await client.exchange(code, callbackUrl)
        logger.debug(`[${runtime}] AUTH CALLBACK: Code exchange completed`)
    } catch (error) {
        logger.error(
            `[${runtime}] AUTH CALLBACK: Exception during code exchange:`,
            error
        )
        return ctx.json(
            {
                message: "Token exchange failed",
                cause: String(error)
            } satisfies ErrorResponse,
            500
        )
    }

    if (exchanged.err) {
        logger.debug(
            `[${runtime}] AUTH CALLBACK: Error exchanging code - ${JSON.stringify(exchanged.err)}`
        )
        return ctx.json(exchanged.err satisfies ErrorResponse, 400)
    }

    logger.debug(`[${runtime}] AUTH CALLBACK: Setting tokens`)
    setTokens(ctx, exchanged.tokens)

    logger.debug(`[${runtime}] AUTH CALLBACK: Redirecting to ${next}`)
    return ctx.redirect(next)
})

export function setTokens(ctx: Context, tokens: Tokens) {
    setCookie(ctx, "access_token", tokens.access, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: tokens.expiresIn
    })
    setCookie(ctx, "refresh_token", tokens.refresh, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 400 // 400 days
    })
}

export default app
