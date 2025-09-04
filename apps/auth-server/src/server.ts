import process from "node:process"
import { basePath, isSeparateAuthServer } from "@karr/auth/issuer-config"
import { PRODUCTION } from "@karr/config"
import logger from "@karr/logger"
import { Hono } from "hono"
import { serve } from "srvx"
import issuer from "./issuer"

const app = new Hono()

if (!isSeparateAuthServer) {
    app.get("/.well-known/oauth-authorization-server", (ctx) => {
        return issuer.fetch(ctx.req.raw)
    })
    app.get("/.well-known/jwks.json", (ctx) => {
        return issuer.fetch(ctx.req.raw)
    })
}

app.route(basePath, issuer)

// Start the server
const server = serve({
    fetch: app.fetch,
    hostname: "0.0.0.0",
    port: 1993,
    silent: true
})

await server.ready()

process.addListener("SIGTERM", () => {
    server.close()
})

logger.success(
    `Server listening on ${server.url} in ${PRODUCTION ? "production" : "dev"} mode`
)
