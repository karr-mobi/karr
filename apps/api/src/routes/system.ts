import { Hono } from "hono"

import { getAppConfig } from "@karr/config"

const hono = new Hono()

/**
 * Get system information
 */
hono.get("/", (c) => {
    return c.json({
        name: `${getAppConfig().APPLICATION_NAME} API`,
        version: "0.1.0",
        description: "API for the federated carpooling system"
    })
})

/**
 * Disallow all bots from accessing the API
 */
hono.get("/robots.txt", (c) => {
    return c.text("User-agent: *\nDisallow: /")
})

/**
 * Get the available API versions
 * @returns Object containing the best version and available versions
 * @example
 * ```
 * GET /versions
 * {
 *   "bestVersion": "v1",
 *   "availableVersions": ["v1"]
 * }
 * ```
 */
hono.get("/versions", (c) => {
    return c.json({
        bestVersion: "v1",
        availableVersions: ["v1"]
    })
})

/**
 * Check the health of the system
 * @returns Object containing the health status
 * @example
 * ```
 * GET /health
 * {
 *   "dbInitialised": true,
 *   "status": "ok"
 * }
 */
hono.get("/health", (c) => {
    const dbInitialised = true
    return c.json({
        dbInitialised,
        status: dbInitialised ? "ok" : "error"
    })
})

export default hono
