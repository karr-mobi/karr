import type {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions,
} from "fastify"
import type { DataResponse, Response, UserWithPrefsAndStatus } from "../lib/types.d.ts"
import logger from "../util/logger.ts"
import { v4 as uuidv4 } from "@std/uuid"
import { handleRequest, tmpResponse } from "../util/helpers.ts"
import { selectUserById } from "../db/users.ts"

export const user = (
    fastify: FastifyInstance,
    _opts: FastifyServerOptions,
) => {
    fastify.get("/", getUser)
    fastify.put("/nickname", tmpResponse) // TODO(@finxol)
    fastify.put("/preferences", tmpResponse) // TODO(@finxol)
    fastify.get("/trips", getUserTrips)
    fastify.get("/bookings", tmpResponse) // TODO(@finxol)
    fastify.get("/bookings/:id", tmpResponse) // TODO(@finxol)
    fastify.delete("/bookings/:id", tmpResponse) // TODO(@finxol)
    fastify.get("/:id", tmpResponse) // TODO(@finxol)
}

/**
 * Get logged in user's info
 * @returns Object containing user info
 */
const getUser = async (
    req: FastifyRequest,
    res: FastifyReply,
): Promise<Response<object>> => {
    // get the user ID from the headers
    const id: string = req.headers.Authorization || "c5976035-d774-49a0-ad03-81246ccbd00a" // default to local test user ID
    logger.debug(`Getting user ${id}`)

    // check the id is a valid UUID
    if (!uuidv4.validate(id)) {
        res.status(400)
        return {
            error: {
                message: "Invalid user ID",
            },
        }
    }

    // get the user from the database and send it back
    return await handleRequest<UserWithPrefsAndStatus>(res, () => selectUserById(id))
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
