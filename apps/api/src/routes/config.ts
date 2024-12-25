import { Hono } from "hono"

import config from "@karr/config"

const hono = new Hono()

/**
 * Get instance config
 */
hono.get("/", (c) => {
    return c.json(config)
})

export default hono
