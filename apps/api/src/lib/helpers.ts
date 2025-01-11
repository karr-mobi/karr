import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import type { CustomHeader, RequestHeader } from "hono/utils/headers"
import { ContentfulStatusCode } from "hono/utils/http-status"

import getAppConfig from "@karr/config"
import { isUUIDv4 } from "@karr/util"
import logger from "@karr/util/logger"

/**
 * Check if a request is authenticated
 * @param c The Hono context object
 * @returns True if the request is authenticated, false otherwise
 */
export function checkAuth(value: Record<RequestHeader | CustomHeader, string>): {
    id: string
} {
    const authorization = value["authorization"]

    if (authorization === undefined || authorization === "") {
        throw new HTTPException(400, {
            message: "Authencation token is required in Authorization header"
        })
    }

    // TODO(@finxol): verify the JWT
    const id: string = authorization

    // check the id is a valid UUID
    if (!isUUIDv4(id)) {
        throw new HTTPException(400, {
            message: "Invalid user ID"
        })
    }

    logger.debug(`User ID: ${id}`)

    return { id }
}

/**
 * Template for a function that returns a response object
 * @param c The Hono context object
 * @returns The response object
 */
export function tmpResponse(c: Context) {
    c.status(418)
    return c.json({
        // get timestamp from the current time using Date
        timestamp: new Date().getTime(),
        data: {
            message: "I'm a teapot",
            img: "https://http.cat/images/418.jpg"
        }
    })
}

/**
 * Helper function to create a response object
 * @param message The error message
 * @param args Any additional arguments
 * @returns The error response object
 */
export function responseErrorObject(
    c: Context,
    error: Error,
    code: ContentfulStatusCode = 500
) {
    return c.json(
        {
            timestamp: new Date().getTime(),
            contact: getAppConfig().ADMIN_EMAIL,
            error
        },
        code
    )
}

/**
 * Helper function which accepts any function
 * and wraps it in a try-catch block
 * Appropriately handles the response object and status code
 * @param c The Hono context object
 * @param fn The function to wrap
 * @returns The result of the function or an error object
 */
export async function handleRequest<T>(c: Context, fn: () => Promise<T>) {
    try {
        const out: T = await fn()
        if (!out) {
            return responseErrorObject(c, new Error("Resource not found"), 404)
        }
        return c.json({
            // deno-lint-ignore no-undef
            timestamp: new Date().getTime(),
            data: out
        })
    } catch (err) {
        logger.error(err)
        return responseErrorObject(
            c,
            new Error("Internal server error", { cause: err }),
            500
        )
    }
}

/**
 * Middleware to check the content type of a request
 * The content type must be application/json
 * @param c The Hono context object
 * @param done The callback to continue the request
 */
export function checkContentType(c: Context, done: () => void) {
    if (c.req.header("content-type") !== "application/json") {
        c.status(400)
        return responseErrorObject(
            c,
            new Error("Invalid content type. Must be application/json"),
            400
        )
    } else {
        done()
    }
}
