import { authBaseUrl } from "@karr/auth/client"
import { subjects, type UserProperties } from "@karr/auth/subjects"
import { API_BASE } from "@karr/config"
import { logger } from "@karr/logger"
import { issuer } from "@openauthjs/openauth"
import type {
    ExchangeError,
    ExchangeSuccess,
    Tokens
} from "@openauthjs/openauth/client"
import { Select } from "@openauthjs/openauth/ui/select"
import type { Theme } from "@openauthjs/openauth/ui/theme"
import type { Context } from "hono"
import { setCookie } from "hono/cookie"
import type { Result } from "neverthrow"
import { runtime } from "std-env"
import { callbackUrl, client } from "@/lib/auth-client"
import type { ErrorResponse } from "@/lib/types"
import { getDriver } from "./drivers"
import { getOrInsertUser } from "./persistence"
import { getGithubUserData } from "./profile-fetchers/github"
import { getGoogleUserData } from "./profile-fetchers/google"
import { providers } from "./providers"
import type { SuccessValues } from "./sucess"
import { UnStorage } from "./unstorage-adapter"

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
    allow(input, _req) {
        return Promise.resolve(
            input.redirectURI === callbackUrl && input.clientID === "karr"
        )
    },
    async success(ctx, value: SuccessValues) {
        let subjectData: Result<UserProperties, string>
        if (value.provider === "password") {
            subjectData = await getOrInsertUser({
                provider: value.provider,
                email: value.email
            })
        } else if (value.provider === "code") {
            subjectData = await getOrInsertUser({
                provider: value.provider,
                email: value.claims.email
            })
        } else if (value.provider === "github") {
            const userData = await getGithubUserData(value.tokenset.access)

            if (userData.isErr()) {
                logger.error(
                    `[${runtime}] Error getting GitHub user data: ${userData.error}`
                )
                throw new Error(userData.error)
            }

            subjectData = await getOrInsertUser(userData.value)
        } else if (value.provider === "google") {
            const userData = getGoogleUserData(value.id)
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

        return ctx.subject("user", subjectData.value)
    }
})

app.get("/callback", async (ctx) => {
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
        return ctx.json(
            {
                message: "Missing code"
            } satisfies ErrorResponse,
            400
        )
    }

    let exchanged: ExchangeSuccess | ExchangeError
    try {
        exchanged = await client.exchange(code, callbackUrl)
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

    setTokens(ctx, exchanged.tokens)

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
