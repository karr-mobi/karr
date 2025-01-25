import { Hono } from "hono"

import logger from "@karr/util/logger"

import { getTrips } from "@/db/trips"
import { handleRequest } from "@/lib/helpers"

/**
 * Federation trips endpoint
 */
const hono = new Hono()

hono.get("/search", async (c) => {
    logger.debug("GET /trips")
    return handleRequest(c, getTrips)
})

export default hono
