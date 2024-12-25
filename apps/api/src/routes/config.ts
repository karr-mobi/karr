import { Hono } from "hono"

import { ADMIN_EMAIL, APPLICATION_NAME } from "@karr/config"

const hono = new Hono()

/**
 * Get instance config
 */
hono.get("/", (c) => {
    return c.json({
        APPLICATION_NAME,
        ADMIN_EMAIL
    })
})

export default hono
