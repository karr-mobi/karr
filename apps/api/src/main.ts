import { build } from "./server.ts"
import { logger } from "@util"
import { LOG_LEVEL, logLevels, PORT, PRODUCTION } from "@config"
import type { Hono } from "hono"

if (PRODUCTION && logLevels.findIndex((l) => l === LOG_LEVEL) < 2) {
    logger.warn(
        `Log level is set to '${LOG_LEVEL}' in a production environment.`,
        "This may result in an excessive amount of logs.",
        "/!\\ It may also log sensitive infornmation",
        "Consider setting LOG_LEVEL to 'info' or 'warn' in .env",
    )
}

logger.info("Starting server...")
// deno-lint-ignore no-undef
logger.info(`Timezone: ${Temporal.Now.timeZoneId()}`)

// Run the server!
try {
    const app: Hono = build()

    Deno.serve({
        port: PORT,
        onListen(info: { hostname: string; port: number; transport: string }) {
            logger.info(`Server listening on ${info.hostname}:${info.port}`)
        },
    }, app.fetch)

    //logger.info(`Server listening on ${host}:${PORT}`)
} catch (err) {
    logger.error(err)
    Deno.exit(1)
}
