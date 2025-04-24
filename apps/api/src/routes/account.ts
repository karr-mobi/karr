import { Hono } from "hono"

import logger from "@karr/logger"

import { handleRequest, responseErrorObject } from "@/lib/helpers"
import type {
    AccountVerified,
    AppVariables,
    DataResponse
} from "@/lib/types.d.ts"
import { isVerified, updateEmail } from "@/db/accounts"

const hono = new Hono<{ Variables: AppVariables }>()

hono.get("/", (c) => {
    logger.debug("Getting user")
    return c.json(<DataResponse<object>>{
        data: {
            name: "John Doe",
            email: "johndoe@example.com"
        }
    })
})

/**
 * Change the logged in user's email address
 * @returns DataResponse if update was successful, ErrorResponse if not
 */
hono.put("/email", async (c) => {
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

    const { email } = await c.req.json()

    // check the nickname is a valid string
    if (typeof email !== "string" || email.length < 1) {
        return responseErrorObject(c, new Error("Invalid email address"), 400)
    }

    // Change the email in the database
    return await handleRequest<boolean>(c, () =>
        updateEmail(subject.properties.id, email)
    )
})

/**
 * Check if a user is verified
 */
hono.get("/verified", async (c) => {
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

    // Check if the user is verified
    return await handleRequest<AccountVerified>(c, () =>
        isVerified(subject.properties.id)
    )
})

hono.post("/verify", (c) => c.text("TODO")) // TODO(@finxol)

/**
 * Delete the logged in user's account
 * All associated bookings, trips and other data will be deleted
 * @returns {Response} Data response if update was successful, ErrorResponse if not
 */
hono.delete("/", async (c) => {
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

    logger.debug(`Deleting user ${subject.properties.id}`)

    // delete the user's account from the database
    return await handleRequest<boolean>(c, async () => {
        // delete the user's bookings

        // delete the user's trips

        // delete the user's account

        // delete the user's profile

        // delete the user's preferences
        return await Promise.resolve(false)
    })
})

export default hono
