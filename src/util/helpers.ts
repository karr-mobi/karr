import type { DataResponse, Response } from "../lib/types.d.ts"
import type { FastifyReply } from "fastify"
import logger from "../util/logger.ts"

/**
 * This is a helper function which accepts any function
 * and wraps it in a try-catch block
 * @param fn The function to wrap
 * @returns The result of the function or an error object
 */
export async function handleRequest<T>(
    res: FastifyReply,
    fn: () => Promise<T>,
): Promise<Response<T>> {
    try {
        const out = await fn()
        if (!out) {
            res.status(404)
            return {
                error: {
                    message: "Not found",
                },
            }
        }
        return <DataResponse<object>> {
            timestamp: Date.now(),
            data: out,
        }
    } catch (err) {
        logger.error(err)
        res.status(500)
        return {
            timestamp: Date.now(),
            error: {
                message: "An error occurred. Please try again later.",
            },
        }
    }
}
