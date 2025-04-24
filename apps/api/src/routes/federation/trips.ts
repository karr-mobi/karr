import { Hono } from "hono"

import logger from "@karr/logger"

import { handleRequest } from "@/lib/helpers"
import { getTrips } from "@/db/trips"

/**
 * Federation trips endpoint
 */
const hono = new Hono()

hono.get("/search", async (c) => {
    logger.debug("GET /trips")
    return handleRequest(c, getTrips)
})

export default hono
