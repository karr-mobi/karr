import type { DataResponse, ErrorResponse, Response } from "../lib/types.d.ts"
import type { FastifyReply, FastifyRequest } from "fastify"
import logger from "../util/logger.ts"
import { ADMIN_EMAIL } from "./config.ts"

/**
 * Template for a function that returns a response object
 * @param _req The FastifyRequest object
 * @param res The FastifyReply object
 * @returns The response object
 */
export function tmpResponse(
    _req: FastifyRequest,
    res: FastifyReply,
): Response<object> {
    res.status(418)
    return {
        timestamp: Temporal.Now.instant().epochMilliseconds,
        data: {
            message: "I'm a teapot",
            img: "https://http.cat/images/418.jpg",
        },
    }
}

/**
 * Helper function to create a response object
 * @param message The error message
 * @param args Any additional arguments
 * @returns The error response object
 */
export function responseErrorObject(
    message: string,
    ...args: unknown[]
): ErrorResponse {
    return {
        timestamp: Temporal.Now.instant().epochMilliseconds,
        contact: ADMIN_EMAIL,
        error: {
            message: message,
            details: args,
        },
    }
}

/**
 * Helper function which accepts any function
 * and wraps it in a try-catch block
 * Appropriately handles the response object and status code
 * @param res The FastifyReply object
 * @param fn The function to wrap
 * @returns The result of the function or an error object
 */
export async function handleRequest<T>(
    res: FastifyReply,
    fn: () => Promise<T>,
): Promise<Response<T>> {
    try {
        const out: T = await fn()
        if (!out) {
            res.status(404)
            return <ErrorResponse> responseErrorObject("Resource not found")
        }
        return <DataResponse<T>> {
            timestamp: Temporal.Now.instant().epochMilliseconds,
            data: out,
        }
    } catch (err) {
        logger.error(err)
        res.status(500)
        return <ErrorResponse> responseErrorObject("Internal server error", err)
    }
}

/**
 * Middleware to check the content type of a request
 * The content type must be application/json
 * @param req The FastifyRequest object
 * @param res The FastifyReply object
 * @param done The callback to continue the request
 */
export function checkContentType(
    req: FastifyRequest,
    res: FastifyReply,
    done: () => void,
): void {
    if (req.headers["content-type"] !== "application/json") {
        res.status(400)
            .send(responseErrorObject("Invalid content type. Must be application/json"))
    } else {
        done()
    }
}
