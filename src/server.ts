import Fastify, { type FastifyInstance } from "fastify"
import cookie from "@fastify/cookie"
import helmet from "@fastify/helmet"

import logger from "./util/logger.ts"

import { system } from "./routes/system.ts"
import { user } from "./routes/user.ts"
import { account } from "./routes/account.ts"
import { trip } from "./routes/trip.ts"

/**
 * Setup the Fastify app with all the routes and plugins
 * @param opts Fastify options
 * @returns Fastify app
 */
export const build = (opts = {}) => {
    const app: FastifyInstance = Fastify(opts)

    app.register(cookie)
    app.register(helmet, {
        global: true,
        dnsPrefetchControl: true,
    })

    app.register(system)
    app.register(user, { prefix: "/v1/user" })
    app.register(account, { prefix: "/v1/account" })
    app.register(trip, { prefix: "/v1/trip" })

    app.addHook("preClose", () => {
        logger.info("Shutting down")
    })

    return app
}
