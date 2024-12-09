import { Hono } from "hono"
import { validator } from "hono/validator"
import { HTTPException } from "hono/http-exception"
import { v4 as uuidv4 } from "@std/uuid"

import { API_VERSION } from "@config"

import system from "./routes/system.ts"
import user from "./routes/user.ts"
import account from "./routes/account.ts"
import trip from "./routes/trip.ts"
import logger from "@util/logger.ts"

/**
 * Setup the Hono app with all the routes and plugins
 * @param opts Hono options
 * @returns Hono app
 */
export const build = (): Hono => {
    const hono: Hono = new Hono()

    // TODO(@finxol): Add security headers

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
    hono.use(validator("header", (value, _c) => {
        const authorization = value["authorization"]

        if (authorization === undefined || authorization === "") {
            throw new HTTPException(400, {
                message: "Authencation token is required in Authorization header",
            })
        }

        // TODO(@finxol): verify the JWT
        const id: string = authorization

        // check the id is a valid UUID
        if (!uuidv4.validate(id)) {
            throw new HTTPException(400, {
                message: "Invalid user ID",
            })
        }

        logger.debug(`User ID: ${id}`)

        return { id }
    }))

    // ============================
    // ===== Protected routes =====
    // ============================
    hono.route(`/${API_VERSION}/user`, user)
    hono.route(`/${API_VERSION}/account`, account)
    hono.route(`/${API_VERSION}/trip`, trip)

    return hono
}
