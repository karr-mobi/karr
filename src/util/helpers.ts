import type { DataResponse, ErrorResponse, Response } from "../lib/types.d.ts"
import type { FastifyReply, FastifyRequest } from "fastify"
import logger from "../util/logger.ts"

/**
 * Template for a function that returns a response object
 * @param res The FastifyReply object
 * @param fn The function to execute
 * @returns The response object
 */
export function tmpResponse(
    _req: FastifyRequest,
    res: FastifyReply,
): Response<object> {
    res.status(418)
    return {
        timestamp: Date.now(),
        data: {
            message: "I'm a teapot",
            img: "https://http.cat/images/418.jpg",
        },
    }
}

/**
 * Helper function which accepts any function
 * and wraps it in a try-catch block
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
            return <ErrorResponse> {
                error: {
                    message: "Not found",
                },
            }
        }
        return <DataResponse<T>> {
            timestamp: Date.now(),
            data: out,
        }
    } catch (err) {
        logger.error(err)
        res.status(500)
        return <ErrorResponse> {
            timestamp: Date.now(),
            error: {
                message: "An error occurred. Please try again later.",
            },
        }
    }
}
