import { API_PORT, PRODUCTION } from "@karr/config"
import logger from "@karr/logger"
import { Hono } from "hono"
import { serve } from "srvx"
import issuer from "./issuer"

const app = new Hono().basePath("/api/v1/auth")

app.route("/", issuer)

// Start the server
const server = serve({
    fetch: app.fetch,
    port: API_PORT,
    hostname: "0.0.0.0",
    silent: true
})

await server.ready()

logger.success(
    `Server listening on ${server.url} in ${PRODUCTION ? "production" : "dev"} mode`
)
