import { API_PORT, PRODUCTION } from "@karr/config"
import logger from "@karr/logger"
import { Hono } from "hono"
import { serve } from "srvx"
import issuer from "./issuer"

const app = new Hono()

app.get("/", (c) => c.text("Karr auth server"))

app.get("/.well-known/oauth-authorization-server", (c) =>
    c.redirect("/api/v1/auth/.well-known/oauth-authorization-server")
)
app.get("/.well-known/jwks.json", (c) =>
    c.redirect("/api/v1/auth/.well-known/jwks.json")
)

app.route("/api/v1/auth", issuer)

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
