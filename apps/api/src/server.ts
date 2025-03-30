import { Hono } from "hono"
import { cors } from "hono/cors"
import { showRoutes } from "hono/dev"
import { secureHeaders } from "hono/secure-headers"
import { createMiddleware } from "hono/factory"

import { API_BASE, FEDERATION, PRODUCTION } from "@karr/config"
import logger from "@karr/util/logger"

import { isAuthenticated } from "@/lib/auth"
import { responseErrorObject } from "@/lib/helpers"
import account from "@/routes/account"
import auth from "@/routes/auth/issuer"
import federation from "@/routes/federation"
import system from "@/routes/system"
import trips from "@/routes/trips"
import user from "@/routes/user"
import { AppVariables } from "./lib/types"

/**
 * Setup the Hono app with all the routes and plugins
 * @param opts Hono options
 * @returns Hono app
 */
export const build = (): Hono<{ Variables: AppVariables }> => {
    const hono = new Hono<{ Variables: AppVariables }>().basePath(API_BASE)

    // Add CORS middleware
    hono.use(
        "/*",
        cors({
            origin: [
                (PRODUCTION ? process.env.WEB_URL : null) || "http://localhost:3000"
            ],
            credentials: true,
            allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowHeaders: ["Content-Type", "Authorization"],
            exposeHeaders: ["Content-Length"],
            maxAge: 600
        })
    )

    // TODO(@finxol): fix security headers
    hono.use(
        "*",
        secureHeaders({
            xFrameOptions: false,
            xXssProtection: false
        })
    )

    // const authMiddleware = async (c: Context, next: Next) => {
    //     logger.debug(`Auth middleware running for: ${c.req.path}`) // Debug log
    //     const subject = await isAuthenticated(c)

    //     if (!subject) {
    //         logger.warn(`Unauthorized request blocked for: ${c.req.path}`)
    //         return responseErrorObject(c, "Unauthorized", 401)
    //     }

    //     // Set the subject in the context
    //     logger.debug(`Setting userSubject in context:`, subject) // Debug log
    //     c.set("userSubject", subject)
    //     await next()
    // }
    // hono.use("/(user|account|trips)/*", authMiddleware)

    // ============================
    // ==== Unprotected routes ====
    // ============================
    const unprotectedRoutes = new Hono()
    unprotectedRoutes.route("/", system)
    unprotectedRoutes.route("/auth", auth)

    // ============================
    // ====== Regular routes ======
    // ============================
    const protectedRoutes = new Hono<{ Variables: AppVariables }>()

    // auth check middleware
    protectedRoutes.use(
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

    protectedRoutes.route("/user", user)
    protectedRoutes.route("/account", account)
    protectedRoutes.route("/trips", trips)

    // ============================
    // ===== Federation routes ====
    // ============================
    if (FEDERATION) {
        const federationRoutes = new Hono().basePath("/federation")
        federationRoutes.route("/", federation)

        hono.route("/", federationRoutes)
    }

    hono.route("/", unprotectedRoutes)
    hono.route("/", protectedRoutes)

    hono.notFound((ctx) => {
        logger.debug(`Not Found: ${ctx.req.path}`)
        return responseErrorObject(ctx, "Not Found", 404)
    })

    if (!PRODUCTION) showRoutes(hono, { verbose: true })

    return hono
}
