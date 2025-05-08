import type { Context } from "hono"

import { tryCatch } from "@karr/util/trycatch"
import logger from "@karr/logger"

/**
 * Template for a function that returns a response object
 * @param c The Hono context object
 * @returns The response object
 */
export function tmpResponse(c: Context) {
    return c.json(
        {
            // get timestamp from the current time using Date
            timestamp: new Date().getTime(),
            data: {
                message: "I'm a teapot",
                img: "https://http.cat/images/418.jpg"
            }
        },
        418
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
    const out = await tryCatch(fn())

    if (!out.success) {
        logger.error(out.error)
        return c.json(
            { message: "Internal server error", cause: out.error },
            500
        )
    }

    if (!out.value) {
        return c.json({ error: "No data found" }, 404)
    }

    return c.json({
        timestamp: new Date().getTime(),
        data: out.value
    })
}

/**
 * Middleware to check the content type of a request
 * The content type must be application/json
 * @param c The Hono context object
 * @param done The callback to continue the request
 */
export function checkContentType(c: Context, done: () => void) {
    if (c.req.header("content-type") !== "application/json") {
        return c.json(
            {
                message: "Invalid content type",
                cause: "Content type must be application/json"
            },
            400
        )
    } else {
        done()
    }
}
