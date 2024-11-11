import { Hono } from "hono"

import { API_VERSION } from "./util/config.ts"

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
    const hono: Hono = new Hono()

    // TODO(@finxol): Add security headers
    // app.register(helmet, {
    //     global: true,
    //     dnsPrefetchControl: true,
    // })

    hono.route(`/${API_VERSION}/user`, user)
    hono.route(`/${API_VERSION}/account`, account)
    hono.route(`/${API_VERSION}/trip`, trip)
    hono.route("/", system)

    return hono
}
