import type {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions,
} from "fastify"
import logger from "../util/logger.ts"

export const system = (
    fastify: FastifyInstance,
    _opts: FastifyServerOptions,
) => {
    fastify.get("/versions", getVersions)
}

const getVersions = (_req: FastifyRequest, _res: FastifyReply) => {
    logger.info("Getting versions")
    return {
        bestVersion: "v1",
        availableVersions: ["v1"],
    }
}
