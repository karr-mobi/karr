import { Hono } from "hono"

import { APPLICATION_NAME } from "@karr/config"
import { APP_VERSION } from "@karr/util/version"

const hono = new Hono()

    /**
     * Get system information
     */
    .get("/", (c) => {
        return c.json({
            name: `${APPLICATION_NAME} API`,
            version: APP_VERSION,
            description: "API for the federated carpooling system"
        })
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
    .get("/versions", (c) => {
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
     *   "status": "ok"
     * }
     */
    .get("/health", (c) => {
        const dbInitialised = true
        return c.json({
            status: dbInitialised ? "ok" : "error"
        })
    })

export default hono
