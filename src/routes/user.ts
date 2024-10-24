import type {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions,
} from "fastify"
import type { DataResponse } from "../lib/types.d.ts"
import logger from "../util/logger.ts"

export const user = (
    fastify: FastifyInstance,
    _opts: FastifyServerOptions,
) => {
    fastify.get("/", getUser)
    fastify.get("/:id", () => {}) // TODO(@finxol)
    fastify.put("/nickname", () => {}) // TODO(@finxol)
    fastify.put("/preferences", () => {}) // TODO(@finxol)
    fastify.get("/trips", getUserTrips)
    fastify.get("/bookings", () => {}) // TODO(@finxol)
    fastify.get("/bookings/:id", () => {}) // TODO(@finxol)
    fastify.delete("/bookings/:id", () => {}) // TODO(@finxol)
}

/**
 * Get logged in user's info
 */
const getUser = (_req: FastifyRequest, _res: FastifyReply) => {
    logger.debug("Getting user")
    return {
        data: {
            name: "John Doe",
            email: "johndoe@example.com",
        },
    }
}

/**
 * Get complete list of logged in user's trips
 * @returns {object} - Object containing list of trips
 */
const getUserTrips = (_req: FastifyRequest, _res: FastifyReply): DataResponse<object> => {
    logger.debug("Getting user trips")
    return {
        data: {
            trips: [],
        },
    }
}
