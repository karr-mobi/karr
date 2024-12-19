import { serve } from "@hono/node-server"
import type { Hono } from "hono"

import { LOG_LEVEL, logLevels, PORT, PRODUCTION } from "@karr/config"
import logger from "@karr/util/logger"

import { build } from "./server.js"

if (PRODUCTION && logLevels.findIndex((l) => l === LOG_LEVEL) < 2) {
    logger.warn(
        `Log level is set to '${LOG_LEVEL}' in a production environment.`,
        "This may result in an excessive amount of logs.",
        "/!\\ It may also log sensitive infornmation",
        "Consider setting LOG_LEVEL to 'info' or 'warn' in .env"
    )
}

logger.info(
    `Starting server in ${PRODUCTION ? "production" : "development"} mode`
)
logger.info(`Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`)

// Run the server!
try {
    const app: Hono = build()

    serve({
        fetch: app.fetch,
        port: PORT
    })

    logger.info(`Server listening on port ${PORT}`)
} catch (err) {
    logger.error(err)
    process.exit(1)
}
