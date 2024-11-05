import { build } from "./server.ts"
import logger from "./util/logger.ts"
import { PORT } from "./util/config.ts"

logger.info("Starting server...")
logger.info(`Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`)

const app = build({
    logger: false,
})

// Run the server!
try {
    app.listen({ PORT })
    logger.info(`Server listening on ${PORT}`)
} catch (err) {
    logger.error(err)
    Deno.exit(1)
}
