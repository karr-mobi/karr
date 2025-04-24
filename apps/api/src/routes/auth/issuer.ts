import { issuer } from "@openauthjs/openauth"
import { GithubProvider } from "@openauthjs/openauth/provider/github"
import { PasswordProvider } from "@openauthjs/openauth/provider/password"
import { PasswordUI } from "@openauthjs/openauth/ui/password"
import { Select } from "@openauthjs/openauth/ui/select"
import type { Theme } from "@openauthjs/openauth/ui/theme"
import { Tokens } from "@openauthjs/openauth/client"
import { setCookie } from "hono/cookie"
import { Context } from "hono"
import { createDatabase } from "db0"
import sqlite from "db0/connectors/node-sqlite"
import dbDriver from "unstorage/drivers/db0"

import { subjects } from "@karr/auth/subjects"
import { API_BASE, APP_URL } from "@karr/config"
import { logger } from "@karr/logger"

import { callbackUrl, client } from "@/lib/auth-client"
import { responseErrorObject } from "@/lib/helpers"
import { UnStorage } from "./unstorage-adapter"
import { authBaseUrl } from "@karr/auth/client"

async function getUser(provider: string, email: string) {
    console.log(provider, email)
    // Get user from database and return user ID
    return "123"
}

const database = createDatabase(
    sqlite({
        name: "openauth"
    })
)

const THEME_OPENAUTH: Theme = {
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
    css: ``
}

const app = issuer({
    basePath: authBaseUrl(API_BASE),
    select: Select({
        providers: {
            github: {
                display: "GitHub"
            },
            password: {
                display: "a password"
            }
        }
    }),
    providers: {
        github: GithubProvider({
            clientSecret: "fc0f07b9daf343cd160226990cb55519c5cfb728",
            clientID: "Ov23lic9kjugi9TMB1oj",
            scopes: ["email"]
        }),
        password: PasswordProvider(
            PasswordUI({
                copy: {
                    error_email_taken: "This email is already taken."
                },
                sendCode: async (email, code) => {
                    console.log(email, code)
                }
            })
        )
    },
    storage: UnStorage({
        driver: dbDriver({
            database,
            tableName: "openauth"
        })
    }),
    subjects,
    theme: THEME_OPENAUTH,
    async allow(input, _req) {
        console.log("Allow check:", {
            audience: input.audience,
            clientID: input.clientID,
            redirectURI: input.redirectURI
        })

        return true // TODO: restrict. For testing, allow all
    },
    async success(ctx, value) {
        logger.info("Success", value)
        if (value.provider === "github") {
            console.log(value.tokenset.access)
            return ctx.subject("user", {
                userID: "test"
            })
        } else if (value.provider === "password") {
            const userID = await getUser(value.provider, value.email)
            return ctx.subject("user", {
                userID
            })
        }

        throw new Error("Invalid provider")
    }
})

app.get("/test", async (ctx) => {
    logger.debug("Test route", ctx.req.url)
    logger.debug("callbackUrl", callbackUrl)
    logger.debug("app url", APP_URL)
    logger.debug("auth base", authBaseUrl(API_BASE))
    logger.debug("auth base with app url", authBaseUrl(API_BASE, APP_URL))
    return ctx.json({ message: "Hello, world!" })
})

app.get("/callback", async (ctx) => {
    const url = new URL(ctx.req.url)
    const code = ctx.req.query("code")
    const error = ctx.req.query("error")
    const next = ctx.req.query("next") ?? `${url.origin}/`

    if (error)
        return responseErrorObject(ctx, {
            message: error,
            cause: ctx.req.query("error_description")
        })

    if (!code)
        return responseErrorObject(ctx, { message: "No code provided" }, 400)

    const exchanged = await client.exchange(code, callbackUrl)

    if (exchanged.err) return ctx.json(exchanged.err, 400)

    logger.debug("Exchanged tokens", exchanged.tokens)

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
