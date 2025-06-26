import { APPLICATION_NAME } from "@karr/config"
import logger from "@karr/logger"
import { tryCatch } from "@karr/util"
import { APP_VERSION } from "@karr/util/version"
import { parse } from "@libs/xml"
import { Hono } from "hono"
import { ofetch } from "ofetch"
import type { ZagazData } from "@/lib/types"

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

    /**
     * Get the average petrol price for france
     */
    .get("/petrol", async (c) => {
        const prices = await tryCatch(
            ofetch("https://api.zagaz.com/prix-moyen.php")
        )

        if (!prices.success) {
            logger.error(prices.error)
            return c.json({ error: prices.error }, 500)
        }

        const data = parse(prices.value)["zagaz-data"] as ZagazData

        return c.json(
            {
                average_price: data.prix_moyen.e10
            },
            200
        )
    })

export default hono
