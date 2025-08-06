import { PRODUCTION } from "@karr/config"
import logger from "@karr/logger"
import { Hono } from "hono"
import { serve } from "srvx"
import issuer from "./issuer"
import { isSeparateAuthServer } from "./lib/config"

const app = new Hono()

app.use(async (ctx, next) => {
    const result = new URL(ctx.req.url)
    result.host = ctx.req.header("x-forwarded-host") || result.host
    result.protocol = ctx.req.header("x-forwarded-proto") || result.protocol
    result.port = ctx.req.header("x-forwarded-port") || result.port
    logger.log("app req url", result.toString())
    await next()
})

if (!isSeparateAuthServer) {
    app.get("/.well-known/oauth-authorization-server", (ctx) => {
        logger.log("app req url", ctx.req.raw)
        return issuer.request(
            "/.well-known/oauth-authorization-server",
            ctx.req.raw,
            {
                headers: ctx.req.raw.headers
            }
        )
    })
    app.get("/.well-known/jwks.json", (ctx) => {
        return issuer.request("/.well-known/jwks.json", {
            headers: ctx.req.raw.headers
        })
    })
}

app.route(isSeparateAuthServer ? "/" : "/api/v1/auth", issuer)

// Start the server
const server = serve({
    fetch: app.fetch,
    hostname: "0.0.0.0",
    port: 1993,
    silent: true
})

await server.ready()

logger.success(
    `Server listening on ${server.url} in ${PRODUCTION ? "production" : "dev"} mode`
)
