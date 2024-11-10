import { build } from "./server.ts"
import logger from "./util/logger.ts"
import { LOG_LEVEL, logLevels, PORT, PRODUCTION } from "./util/config.ts"

if (PRODUCTION && logLevels.findIndex((l) => l === LOG_LEVEL) < 2) {
    logger.warn(
        `Log level is set to '${LOG_LEVEL}' in a production environment.`,
        "This may result in an excessive amount of logs.",
        "/!\\ It may also log sensitive infornmation",
        "Consider setting LOG_LEVEL to 'info' or 'warn' in .env",
    )
}

logger.info("Starting server...")
logger.info(`Timezone: ${Temporal.Now.timeZoneId()}`)

const app = build({
    logger: false,
})

// Run the server!
try {
    const host = "localhost"
    app.listen({
        host,
        port: PORT,
    })
    logger.info(`Server listening on ${host}:${PORT}`)
} catch (err) {
    logger.error(err)
    Deno.exit(1)
}
