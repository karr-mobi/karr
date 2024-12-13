import { logger } from "@util"
import { ADMIN_EMAIL } from "@config"
import type { Context } from "hono"

/**
 * Template for a function that returns a response object
 * @param c The Hono context object
 * @returns The response object
 */
export function tmpResponse(
    c: Context,
) {
    c.status(418)
    return c.json({
        // deno-lint-ignore no-undef
        timestamp: Temporal.Now.instant().epochMilliseconds,
        data: {
            message: "I'm a teapot",
            img: "https://http.cat/images/418.jpg",
        },
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
    message: string,
    ...args: unknown[]
) {
    return c.json({
        // deno-lint-ignore no-undef
        timestamp: Temporal.Now.instant().epochMilliseconds,
        contact: ADMIN_EMAIL,
        error: {
            message: message,
            details: args,
        },
    })
}

/**
 * Helper function which accepts any function
 * and wraps it in a try-catch block
 * Appropriately handles the response object and status code
 * @param c The Hono context object
 * @param fn The function to wrap
 * @returns The result of the function or an error object
 */
export async function handleRequest<T>(
    c: Context,
    fn: () => Promise<T>,
) {
    try {
        const out: T = await fn()
        if (!out) {
            c.status(404)
            return responseErrorObject(c, "Resource not found")
        }
        return c.json({
            // deno-lint-ignore no-undef
            timestamp: Temporal.Now.instant().epochMilliseconds,
            data: out,
        })
    } catch (err) {
        logger.error(err)
        c.status(500)
        return responseErrorObject(c, "Internal server error", err)
    }
}

/**
 * Middleware to check the content type of a request
 * The content type must be application/json
 * @param c The Hono context object
 * @param done The callback to continue the request
 */
export function checkContentType(
    c: Context,
    done: () => void,
) {
    if (c.req.header("content-type") !== "application/json") {
        c.status(400)
        return responseErrorObject(c, "Invalid content type. Must be application/json")
    } else {
        done()
    }
}
