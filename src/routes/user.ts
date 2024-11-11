import type { UserPublicProfile, UserWithPrefsAndStatus } from "../lib/types.d.ts"
import logger from "../util/logger.ts"
import { v4 as uuidv4 } from "@std/uuid"
import {
    checkContentType,
    handleRequest,
    responseErrorObject,
    tmpResponse,
} from "../util/helpers.ts"
import { selectUserById, selectUserProfileById, updateNickname } from "../db/users.ts"
import { Hono } from "hono"

const hono = new Hono()

// ==============================================
// ========== Register endpoint routes ==========
// ==============================================

/**
 * Get logged in user's info
 * @returns Object containing user info
 */
hono.get("/", async (c) => {
    // get the user ID from the headers
    const id: string = c.req.header("Authorization") || ""

    // check the id is a valid UUID
    if (!uuidv4.validate(id)) {
        c.status(400)
        return responseErrorObject(c, "Invalid user ID")
    }

    // get the user from the database and send it back
    return await handleRequest<UserWithPrefsAndStatus>(c, () => selectUserById(id))
})

/**
 * Change the logged in user's nickname
 * @returns {Response} Data response if update was successful, ErrorResponse if not
 */
hono.put("/nickname", async (c) => { // TODO(@finxol): Add validation for nickname
    const id: string = c.req.header("Authorization") || ""
    const { nickname } = await c.req.json()

    // check the id is a valid UUID
    if (!uuidv4.validate(id)) {
        c.status(400)
        return responseErrorObject(c, "Invalid user ID")
    }

    // check the nickname is a valid string
    if (typeof nickname !== "string" || nickname.length < 1) {
        c.status(400)
        return responseErrorObject(c, "Invalid nickname")
    }

    // update the user's nickname in the database
    return await handleRequest<boolean>(c, () => updateNickname(id, nickname))
})

/**
 * Update the logged in user's preferences
 * __Not implemented yet__
 * @returns {Response} DataResponse if update was successful, ErrorResponse if not
 */
hono.put("/preferences", async (c) => { // TODO(@finxol): Implement this
    return tmpResponse(c)
})

/**
 * Get complete list of logged in user's trips
 * __Not implemented yet__
 * @returns {object} - Object containing list of trips
 */
hono.get("/trips", async (c) => { // TODO(@finxol): Implement this
    return tmpResponse(c)
})

/**
 * Get all bookings for the logged in user
 * __Not implemented yet__
 * @returns {Response} DataResponse if fetch was successful, ErrorResponse if not
 */
hono.get("/bookings", async (c) => { // TODO(@finxol): Implement this
    return tmpResponse(c)
})

/**
 * Get specific booking details. The logged in user must be concerned with the booking
 * __Not implemented yet__
 * @returns {Response} DataResponse if fetch was successful, ErrorResponse if not
 */
hono.get("/bookings/:id", async (c) => { // TODO(@finxol): Implement this
    return tmpResponse(c)
})

/**
 * Delete a specific booking. The logged in user must be concerned with the booking
 * __Not implemented yet__
 * @returns {Response} DataResponse if deletion was successful, ErrorResponse if not
 */
hono.delete("/bookings/:id", async (c) => { // TODO(@finxol): Implement this
    return tmpResponse(c)
})

/**
 * Get the public profile of a user. Only limited information is available.
 * @param {string} id - The user ID. Must be a valid UUID v4
 * @returns {Response} DataResponse if fetch was successful, ErrorResponse if not
 */
hono.get(
    "/profile/:id{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}",
    async (c) => {
        // get the user ID from the route params
        const id: string = c.req.param("id")

        // check the id is a valid UUID
        if (!uuidv4.validate(id)) {
            c.status(400)
            return responseErrorObject(c, "Invalid user ID")
        }

        // get the user from the database and send it back
        return await handleRequest<UserPublicProfile>(c, () => selectUserProfileById(id))
    },
)

export default hono
