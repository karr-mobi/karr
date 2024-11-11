import type { DataResponse } from "../lib/types.d.ts"
import logger from "../util/logger.ts"
import { Hono } from "hono"

const hono = new Hono()

hono.get("/", (c) => {
    logger.debug("Getting user")
    return c.json(
        <DataResponse<object>> {
            data: {
                name: "John Doe",
                email: "johndoe@example.com",
            },
        },
    )
})

hono.get("/verified", (c) => c.text("TODO")) // TODO(@finxol)
hono.post("/verify", (c) => c.text("TODO")) // TODO(@finxol)
hono.delete("/", (c) => c.text("TODO")) // TODO(@finxol)

export default hono
