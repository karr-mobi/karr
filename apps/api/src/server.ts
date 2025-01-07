import { Hono } from "hono"
import { cors } from "hono/cors"
import { HTTPException } from "hono/http-exception"
import { validator } from "hono/validator"

import { API_VERSION } from "@karr/config"
import { isUUIDv4 } from "@karr/util"
import logger from "@karr/util/logger"

import account from "~/routes/account"
import configRoutes from "~/routes/config"
import system from "~/routes/system"
import trip from "~/routes/trip"
import user from "~/routes/user"

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
            origin: [
                (prod ? process.env.WEB_URL : null) || "http://localhost:3000"
            ],
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
    hono.route(`/${API_VERSION}/config`, configRoutes)

    // =============================
    // ======== Middlewares ========
    // =============================
    /**
     * Check if a user is logged in by checking the Authorization header
     * @param req The FastifyRequest objec
     */
    hono.use(
        validator("header", (value, _c) => {
            const authorization = value["authorization"]

            if (authorization === undefined || authorization === "") {
                throw new HTTPException(400, {
                    message:
                        "Authencation token is required in Authorization header"
                })
            }

            // TODO(@finxol): verify the JWT
            const id: string = authorization

            // check the id is a valid UUID
            if (!isUUIDv4(id)) {
                throw new HTTPException(400, {
                    message: "Invalid user ID"
                })
            }

            logger.debug(`User ID: ${id}`)

            return { id }
        })
    )

    // ============================
    // ===== Protected routes =====
    // ============================
    hono.route(`/${API_VERSION}/user`, user)
    hono.route(`/${API_VERSION}/account`, account)
    hono.route(`/${API_VERSION}/trip`, trip)

    return hono
}
