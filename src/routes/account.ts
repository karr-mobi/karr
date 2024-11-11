import type { AccountVerified, DataResponse } from "../lib/types.d.ts"
import logger from "../util/logger.ts"
import { Hono } from "hono"
import { v4 as uuidv4 } from "@std/uuid"
import { isVerified, updateEmail } from "../db/accounts.ts"
import { handleRequest, responseErrorObject } from "../util/helpers.ts"

const hono = new Hono()

hono.get("/", (c) => {
    logger.debug("Getting user")
    return c.json(
        <DataResponse<object>> {
            data: {
                name: "John Doe",
                email: "johndoe@example.com",
            },
        },
    )
})

/**
 * Change the logged in user's email address
 * @returns DataResponse if update was successful, ErrorResponse if not
 */
hono.put("/email", async (c) => {
    // get the user ID from the headers
    const id: string = c.req.header("Authorization") || ""
    const { email } = await c.req.json()

    // check the id is a valid UUID
    if (!uuidv4.validate(id)) {
        c.status(400)
        return responseErrorObject(c, "Invalid user ID")
    }

    // check the nickname is a valid string
    if (typeof email !== "string" || email.length < 1) {
        c.status(400)
        return responseErrorObject(c, "Invalid nickname")
    }

    // Change the email in the database
    return await handleRequest<boolean>(c, () => updateEmail(id, email))
})

/**
 * Check if a user is verified
 */
hono.get("/verified", async (c) => {
    // get the user ID from the headers
    const id: string = c.req.header("Authorization") || ""

    // check the id is a valid UUID
    if (!uuidv4.validate(id)) {
        c.status(400)
        return responseErrorObject(c, "Invalid user ID")
    }

    // Check if the user is verified
    return await handleRequest<AccountVerified>(c, () => isVerified(id))
})

hono.post("/verify", (c) => c.text("TODO")) // TODO(@finxol)
hono.delete("/", (c) => c.text("TODO")) // TODO(@finxol)

export default hono
