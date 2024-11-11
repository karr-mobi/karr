import logger from "../util/logger.ts"
import { Hono } from "hono"

const hono = new Hono()

hono.get("/versions", (c) => {
    logger.info("Getting versions")
    return c.json({
        bestVersion: "v1",
        availableVersions: ["v1"],
    })
})

hono.get("/health", (c) => {
    logger.info("Checking health")
    const dbInitialised = true
    return c.json({
        dbInitialised,
        status: dbInitialised ? "ok" : "error",
    })
})

export default hono
