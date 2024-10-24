import type {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions,
} from "fastify"
import type { DataResponse } from "../lib/types.d.ts"
import logger from "../util/logger.ts"

export const trip = (
    fastify: FastifyInstance,
    _opts: FastifyServerOptions,
) => {
    // Define all the routes for the trip module
    fastify.get("/:id", getTripById)
}

/**
 * Get logged in user's info
 */
const getTripById = (
    req: FastifyRequest,
    _res: FastifyReply,
): DataResponse<object> => {
    logger.debug("Getting user")
    const params: { id: string } = req.params as { id: string }
    return {
        data: {
            id: params.id,
            name: "Random Trip",
        },
    }
}
