import { pino, type TransportTargetOptions } from "pino"
import { isProduction } from "std-env"

const opts: { transport?: TransportTargetOptions } = {}

if (!isProduction) {
    opts.transport = {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:HH:MM:ss.l",
            ignore: "pid,hostname"
        }
    }
}

export const logger = pino(opts)

logger.info({ key: "value" })
