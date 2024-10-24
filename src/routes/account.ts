import type {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions,
} from "fastify"
import type { DataResponse } from "../lib/types.d.ts"
import logger from "../util/logger.ts"

export const account = (
    fastify: FastifyInstance,
    _opts: FastifyServerOptions,
) => {
    fastify.get("/", getAccount)
    fastify.get("/verified", getVerified) // TODO(@finxol)
    fastify.post("/verify", () => {}) // TODO(@finxol)
    fastify.delete("/", () => {}) // TODO(@finxol)
}

/**
 * Get logged in user's info
 */
const getAccount = (_req: FastifyRequest, _res: FastifyReply): DataResponse<object> => {
    logger.debug("Getting user")
    return {
        data: {
            name: "John Doe",
            email: "johndoe@example.com",
        },
    }
}

const getVerified = (
    _req: FastifyRequest,
    _res: FastifyReply,
): DataResponse<{ verified: boolean }> => {
    logger.debug("Getting user verification status")
    return {
        timestamp: new Date().getTime(),
        data: {
            verified: true,
        },
    }
}
