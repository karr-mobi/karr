import logger from "@karr/logger"
import { Hono } from "hono"
import { getTrips } from "@/lib/db/trips"
import { handleRequest } from "@/lib/helpers"

/**
 * Federation trips endpoint
 */
const hono = new Hono()

hono.get("/search", (c) => {
    logger.debug("GET /trips")
    return handleRequest(c, getTrips)
})

export default hono
