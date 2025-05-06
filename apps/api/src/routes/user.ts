import { Hono } from "hono"

import { handleRequest, responseErrorObject, tmpResponse } from "@/lib/helpers"
import type {
    UserWithPrefsAndStatus as _UserWithPrefsAndStatus,
    AppVariables
} from "@/lib/types.d.ts"
import {
    selectUserById,
    selectUserProfileById,
    updateNickname
} from "@/lib/db/users"
import logger from "@karr/logger"
import { getUserSub } from "@/util/subject"

const hono = new Hono<{ Variables: AppVariables }>()

    // ==============================================
    // ========== Register endpoint routes ==========
    // ==============================================

    /**
     * Get logged in user's info
     * @returns Object containing user info
     */
    .get("/", async (c) => {
        const subject = getUserSub(c)

        if (!subject) {
            return responseErrorObject(
                c,
                "User subject missing in context",
                500
            )
        }

        logger.debug(`hit route /user`)

        const user = await selectUserById(subject.id)

        if (user.isErr()) {
            return responseErrorObject(c, user.error, 500)
        }

        if (!user.value) {
            return responseErrorObject(c, "User not found", 404)
        }

        return c.json({
            timestamp: new Date().getTime(),
            data: user.value
        })
    })

    /**
     * Change the logged in user's nickname
     * @returns {Response} Data response if update was successful, ErrorResponse if not
     */
    .put("/nickname", async (c) => {
        // TODO(@finxol): Add validation for nickname

        // Get the subject from the context
        const subject = c.get("userSubject")

        // Middleware should prevent this, but good practice to check
        if (!subject?.properties?.id) {
            logger.error("User subject missing in context for GET /user")
            return responseErrorObject(
                c,
                "Internal Server Error: Subject missing",
                500
            )
        }

        const { nickname } = await c.req.json()

        // check the nickname is a valid string
        if (typeof nickname !== "string" || nickname.length < 1) {
            return responseErrorObject(c, new Error("Invalid nickname"), 400)
        }

        // update the user's nickname in the database
        return await handleRequest<boolean>(c, () =>
            updateNickname(subject.properties.id, nickname)
        )
    })

    /**
     * Update the logged in user's preferences
     * __Not implemented yet__
     * @returns {Response} DataResponse if update was successful, ErrorResponse if not
     */
    .put("/preferences", (c) => {
        // TODO(@finxol): Implement this
        return tmpResponse(c)
    })

    /**
     * Get complete list of logged in user's trips
     * __Not implemented yet__
     * @returns {object} - Object containing list of trips
     */
    .get("/trips", (c) => {
        // TODO(@finxol): Implement this
        return tmpResponse(c)
    })

    /**
     * Get all bookings for the logged in user
     * __Not implemented yet__
     * @returns {Response} DataResponse if fetch was successful, ErrorResponse if not
     */
    .get("/bookings", (c) => {
        // TODO(@finxol): Implement this
        return tmpResponse(c)
    })

    /**
     * Get specific booking details. The logged in user must be concerned with the booking
     * __Not implemented yet__
     * @returns {Response} DataResponse if fetch was successful, ErrorResponse if not
     */
    .get("/bookings/:id", (c) => {
        // TODO(@finxol): Implement this
        return tmpResponse(c)
    })

    /**
     * Delete a specific booking. The logged in user must be concerned with the booking
     * __Not implemented yet__
     * @returns {Response} DataResponse if deletion was successful, ErrorResponse if not
     */
    .delete("/bookings/:id", (c) => {
        // TODO(@finxol): Implement this
        return tmpResponse(c)
    })

    /**
     * Get the public profile of a user. Only limited information is available.
     * @param {string} id - The user ID. Must be a valid UUID v4
     * @returns {Response} DataResponse if fetch was successful, ErrorResponse if not
     */
    .get(
        "/profile/:id{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}",
        async (c) => {
            const id = c.req.param("id")

            // get the user from the database and send it back
            return await handleRequest(c, () => selectUserProfileById(id))
        }
    )

export default hono
