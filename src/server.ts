import { Hono } from "hono"

import system from "./routes/system.ts"
import user from "./routes/user.ts"
import account from "./routes/account.ts"
import trip from "./routes/trip.ts"

/**
 * Setup the Hono app with all the routes and plugins
 * @param opts Hono options
 * @returns Hono app
 */
export const build = (): Hono => {
    const API_VERSION = "v1"

    const hono: Hono = new Hono().basePath(API_VERSION)

    // TODO(@finxol): Add security headers
    // app.register(helmet, {
    //     global: true,
    //     dnsPrefetchControl: true,
    // })

    hono.route("/", system)
    hono.route("/user", user)
    hono.route("/account", account)
    hono.route("/trip", trip)

    return hono
}
