import { Hono } from "hono"
import { cors } from "hono/cors"
import { validator } from "hono/validator"

import getAppConfig from "@karr/config"
import { isUUIDv4 } from "@karr/util"
import logger from "@karr/util/logger"

import account from "~/routes/account"
import system from "~/routes/system"
import trip from "~/routes/trip"
import user from "~/routes/user"
import { responseErrorObject } from "./lib/helpers"

const prod: boolean = process.env.NODE_ENV === "production"

/**
 * Setup the Hono app with all the routes and plugins
 * @param opts Hono options
 * @returns Hono app
 */
export const build = (): Hono => {
    const hono: Hono = new Hono()

    // TODO(@finxol): Add security headers

    // Add CORS middleware
    hono.use(
        "/*",
        cors({
            origin: [(prod ? process.env.WEB_URL : null) || "http://localhost:3000"],
            credentials: true,
            allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowHeaders: ["Content-Type", "Authorization"],
            exposeHeaders: ["Content-Length"],
            maxAge: 600
        })
    )

    // ============================
    // ==== Unprotected routes ====
    // ============================
    hono.route("/", system)

    // =============================
    // ======== Middlewares ========
    // =============================
    /**
     * Check if a user is logged in by checking the Authorization header
     * @param req The FastifyRequest objec
     */
    hono.use(
        validator("header", (value, c) => {
            const authorization = value["authorization"]

            if (authorization === undefined || authorization === "") {
                return responseErrorObject(
                    c,
                    new Error("Unauthorized", {
                        cause: "Auth token is required in Authorization header"
                    }),
                    401
                )
            }

            // TODO(@finxol): verify the JWT
            const id: string = authorization

            // check the id is a valid UUID
            if (!isUUIDv4(id)) {
                return responseErrorObject(
                    c,
                    new Error("Unauthorized", {
                        cause: "Invalid user ID"
                    }),
                    401
                )
            }

            logger.debug(`User ID: ${id}`)

            return { id }
        })
    )

    // ============================
    // ===== Protected routes =====
    // ============================
    hono.route(`/${getAppConfig().API_VERSION}/user`, user)
    hono.route(`/${getAppConfig().API_VERSION}/account`, account)
    hono.route(`/${getAppConfig().API_VERSION}/trip`, trip)

    return hono
}
