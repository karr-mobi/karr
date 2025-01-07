import { serve } from "@hono/node-server"
import type { Hono } from "hono"

import getAppConfig, { logLevels } from "@karr/config"
import logger from "@karr/util/logger"

import { drizzleMigrate } from "~/db/migrate"
import { build } from "~/server"

if (
    getAppConfig().PRODUCTION &&
    logLevels.findIndex((l) => l === getAppConfig().LOG_LEVEL) < 2
) {
    logger.warn(
        `Log level is set to '${getAppConfig().LOG_LEVEL}' in a production environment.`,
        "This may result in an excessive amount of logs.",
        "/!\\ It may also log sensitive infornmation",
        "Consider setting LOG_LEVEL to 'info' or 'warn' in .env"
    )
}

logger.info(
    `Starting server in ${getAppConfig().PRODUCTION ? "production" : "development"} mode`
)
logger.info(`TZ=${Intl.DateTimeFormat().resolvedOptions().timeZone}`)

// Run the server!
try {
    // Run database migrations
    await drizzleMigrate()

    // Build the server
    const app: Hono = build()

    // Start the server
    serve({
        fetch: app.fetch,
        port: getAppConfig().API_PORT
    })

    logger.success(`Server listening on port ${getAppConfig().API_PORT}`)
} catch (err) {
    logger.error(err)
    process.exit(1)
}
