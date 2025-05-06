import { Hono } from "hono"
import { cors } from "hono/cors"
import { showRoutes } from "hono/dev"
import { secureHeaders } from "hono/secure-headers"
import { createMiddleware } from "hono/factory"

import { API_BASE, APP_URL, PRODUCTION } from "@karr/config"
import logger from "@karr/logger"

import { isAuthenticated } from "@/lib/auth"
import { responseErrorObject } from "@/lib/helpers"
import account from "@/routes/account"
import auth from "@/routes/auth/issuer"
import system from "@/routes/system"
import trips from "@/routes/trips"
import user from "@/routes/user"
import { AppVariables } from "./lib/types"

// ============================
// ==== Unprotected routes ====
// ============================
const unprotectedRoutes = new Hono().route("/", system).route("/auth", auth)

// ============================
// ====== Regular routes ======
// ============================
const protectedRoutes = new Hono<{ Variables: AppVariables }>()

    // auth check middleware
    .use(
        createMiddleware(async (c, next) => {
            const subject = await isAuthenticated(c)

            if (!subject) {
                logger.warn("Unauthorized request attempt blocked") // Use warn or debug
                return responseErrorObject(c, "Unauthorized", 401)
            }

            // Set the subject in the context
            c.set("userSubject", subject)
            logger.debug("User subject set in context", subject) // Use debug or trace
            await next()
        })
    )

    .route("/user", user)
    .route("/account", account)
    .route("/trips", trips)

export const app = new Hono<{ Variables: AppVariables }>()
    .basePath(API_BASE)

    // Add CORS middleware
    .use(
        "/*",
        cors({
            origin: [APP_URL],
            credentials: true,
            allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowHeaders: ["Content-Type", "Authorization"],
            exposeHeaders: ["Content-Length"],
            maxAge: 600
        })
    )

    // TODO(@finxol): fix security headers
    .use(
        "*",
        secureHeaders({
            xFrameOptions: false,
            xXssProtection: false
        })
    )

    .route("/", unprotectedRoutes)
    .route("/", protectedRoutes)

    .notFound((ctx) => {
        logger.debug(`Not Found: ${ctx.req.path}`)
        return responseErrorObject(ctx, "Not Found", 404)
    })

const printRoutes = false
if (!PRODUCTION && printRoutes) showRoutes(app, { verbose: printRoutes })
