import logger from "../util/logger.ts"
import { Hono } from "hono"

const hono = new Hono()

/**
 * Get system information
 */
hono.get("/", (c) => {
    logger.info("Getting system info")
    return c.json({
        name: "Fedicarpool",
        version: "0.1.0",
        description: "API for the federated carpooling system",
    })
})

/**
 * Disallow all bots from accessing the API
 */
hono.get("/robots.txt", (c) => {
    logger.info("Getting system info")
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
    logger.info("Getting versions")
    return c.json({
        bestVersion: "v1",
        availableVersions: ["v1"],
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
    logger.info("Checking health")
    const dbInitialised = true
    return c.json({
        dbInitialised,
        status: dbInitialised ? "ok" : "error",
    })
})

export default hono
