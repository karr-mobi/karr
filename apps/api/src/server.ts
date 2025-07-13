import { API_BASE, APP_URL, PRODUCTION } from "@karr/config"
import { logger } from "@karr/logger"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { showRoutes } from "hono/dev"
import { createMiddleware } from "hono/factory"
import { secureHeaders } from "hono/secure-headers"
import { trimTrailingSlash } from "hono/trailing-slash"

import { isAuthenticated } from "@/lib/auth"
import account from "@/routes/account"
import admin from "@/routes/admin"
import auth from "@/routes/auth/issuer"
import system from "@/routes/system"
import trips from "@/routes/trips"
import user from "@/routes/user"
import type { AppVariables } from "./lib/types"

const authCheckMiddleware = createMiddleware(async (c, next) => {
    const subject = await isAuthenticated(c)

    if (!subject) {
        logger.debug("Unauthorized request attempt blocked")
        return c.json(
            {
                error: "Unauthorized"
            },
            401
        )
    }

    // Set the subject in the context
    c.set("userSubject", subject)
    await next()
})

// ============================
// ==== Unprotected routes ====
// ============================
const unprotectedRoutes = new Hono().route("/", system).route("/auth", auth)

// ============================
// ====== Regular routes ======
// ============================
export const protectedRoutes = new Hono<{ Variables: AppVariables }>()

    // auth check middleware
    .use("/user/*", authCheckMiddleware)
    .use("/account/*", authCheckMiddleware)
    .use("/trips/*", authCheckMiddleware)
    .use("/admin/*", authCheckMiddleware)

    .route("/user", user)
    .route("/account", account)
    .route("/trips", trips)
    .route("/admin", admin)

export const app = new Hono<{ Variables: AppVariables }>()
    .basePath(API_BASE)
    .use(trimTrailingSlash())

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

const printRoutes = false
if (!PRODUCTION && printRoutes) showRoutes(app, { verbose: printRoutes })
