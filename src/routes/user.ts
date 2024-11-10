import type {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions,
} from "fastify"
import type {
    DataResponse,
    ErrorResponse,
    Response,
    Users,
    UserWithPrefsAndStatus,
} from "../lib/types.d.ts"
import logger from "../util/logger.ts"
import { v4 as uuidv4 } from "@std/uuid"
import {
    checkContentType,
    handleRequest,
    responseErrorObject,
    tmpResponse,
} from "../util/helpers.ts"
import { selectUserById, updateNickname } from "../db/users.ts"

// ==============================================
// ========== Register endpoint routes ==========
// ==============================================

export const user = (
    fastify: FastifyInstance,
    _opts: FastifyServerOptions,
) => {
    fastify.get("/", getUser)
    fastify.put("/nickname", {
        preValidation: checkContentType,
    }, changeNickname)
    fastify.put("/preferences", {
        preValidation: checkContentType,
    }, updateUserPreferences)
    fastify.get("/trips", getUserTrips)
    fastify.get("/bookings", getAllUserBookings)
    fastify.get("/bookings/:id", getUserBooking)
    fastify.delete("/bookings/:id", deleteUserBooking)
    fastify.get("/:id", getUserPublicProfile)
}

// ==============================================
// =========== Endpoint handler logic ===========
// ==============================================

/**
 * Get logged in user's info
 * @returns Object containing user info
 */
async function getUser(
    req: FastifyRequest,
    res: FastifyReply,
): Promise<Response<object>> {
    // get the user ID from the headers
    const id: string = req.headers.authorization || ""

    // check the id is a valid UUID
    if (!uuidv4.validate(id)) {
        res.status(400)
        return <ErrorResponse> responseErrorObject("Invalid user ID")
    }

    // get the user from the database and send it back
    return await handleRequest<UserWithPrefsAndStatus>(res, () => selectUserById(id))
}

/**
 * Change the logged in user's nickname
 * @returns {Response} Data response if update was successful, ErrorResponse if not
 */
async function changeNickname(
    req: FastifyRequest,
    res: FastifyReply,
): Promise<Response<boolean>> {
    const id: string = req.headers.authorization || ""
    const nickname: string = req.body.nickname

    // check the id is a valid UUID
    if (!uuidv4.validate(id)) {
        res.status(400)
        return <ErrorResponse> responseErrorObject("Invalid user ID")
    }

    // check the nickname is a valid string
    if (typeof nickname !== "string" || nickname.length < 1) {
        return <ErrorResponse> responseErrorObject("Invalid nickname")
    }

    // update the user's nickname in the database
    return await handleRequest<boolean>(res, () => updateNickname(id, nickname))
}

/**
 * Update the logged in user's preferences
 * @returns {Response} DataResponse if update was successful, ErrorResponse if not
 */
async function updateUserPreferences(
    req: FastifyRequest,
    res: FastifyReply,
): Promise<Response<boolean>> {
    // TODO(@finxol): Implement this
    return await new Promise((resolve) => {
        logger.debug("Updating user preferences")
        resolve(tmpResponse(req, res))
    })
}

/**
 * Get complete list of logged in user's trips
 * @returns {object} - Object containing list of trips
 */
function getUserTrips(
    _req: FastifyRequest,
    _res: FastifyReply,
): DataResponse<object> {
    logger.debug("Getting user trips")
    return {
        data: {
            trips: [],
        },
    }
}

/**
 * Get all bookings for the logged in user
 * @returns {Response} DataResponse if fetch was successful, ErrorResponse if not
 */
async function getAllUserBookings(
    req: FastifyRequest,
    res: FastifyReply,
): Promise<Response<boolean>> {
    // TODO(@finxol): Implement this
    return await new Promise((resolve) => {
        logger.debug("Getting all user bookings")
        resolve(tmpResponse(req, res))
    })
}

/**
 * Get specific booking details. The logged in user must be concerned with the booking
 * @returns {Response} DataResponse if fetch was successful, ErrorResponse if not
 */
async function getUserBooking(
    req: FastifyRequest,
    res: FastifyReply,
): Promise<Response<boolean>> {
    // TODO(@finxol): Implement this
    // req.body should contain the booking ID
    return await new Promise((resolve) => {
        logger.debug("Getting user booking details")
        resolve(tmpResponse(req, res))
    })
}

/**
 * Delete a specific booking. The logged in user must be concerned with the booking
 * @returns {Response} DataResponse if deletion was successful, ErrorResponse if not
 */
async function deleteUserBooking(
    req: FastifyRequest,
    res: FastifyReply,
): Promise<Response<boolean>> {
    // TODO(@finxol): Implement this
    // req.body should contain the booking ID
    return await new Promise((resolve) => {
        logger.debug("Deleting user booking")
        resolve(tmpResponse(req, res))
    })
}

/**
 * Delete a specific booking. The logged in user must be concerned with the booking
 * @returns {Response} DataResponse if fetch was successful, ErrorResponse if not
 */
async function getUserPublicProfile(
    req: FastifyRequest,
    res: FastifyReply,
): Promise<Response<Users>> {
    // TODO(@finxol): Implement this
    // req.params should contain the user ID
    return await new Promise((resolve) => {
        logger.debug("Getting user public profile info")
        resolve(tmpResponse(req, res))
    })
}
