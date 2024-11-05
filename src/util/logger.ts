// deno-lint-ignore-file no-console -- all logging behaviour is defined here

import { blue, cyan, gray, green, magenta, red, underline, yellow } from "@std/fmt/colors"
import { LOG_LEVEL, LOG_TIMESTAMP, TZ } from "./config.ts"

const prefix = () => {
    const now = new Date().toLocaleString("en-GB", {
        timeZone: TZ,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
    return LOG_TIMESTAMP ? `[${now}] ` : ""
}

const formatArg = (arg: unknown): string => {
    if (typeof arg === "object" && arg !== null) {
        return JSON.stringify(arg, null, 2) // Pretty-print objects
    }
    return String(arg) // Convert other types to string
}

/**
 * A simple logger that logs messages to the console.
 *
 * The logger has 5 levels: trace, debug, info, warn, and error.
 * The log level can be set using the LOG_LEVEL environment variable.
 *
 * The logger also logs timestamps, which can be disabled using the LOG_TIMESTAMP environment variable.
 * @param args - The arguments to log
 * @example
 * ```ts
 * import logger from "./util/logger.ts"
 * logger.info("Hello, world!")
 * logger.error("Major error", error, 123)
 * ```
 */
export default {
    /**
     * Log a message to the console, with no particular level.
     * Is only logged if the log level is set to trace, debug, or info.
     * @param args - The arguments to log
     * @example
     * Pass any number of arguments to log
     * ```ts
     * logger.log("Hello, world!", variable, 123)
     * ```
     */
    log: (...args: unknown[]) => {
        if (["trace", "debug", "info"].includes(LOG_LEVEL)) {
            console.log(cyan(`${prefix()}>`), ...args)
        }
    },
    /**
     * Log a message to the console with the trace level.
     * Is logged for all log levels
     * @param args - The arguments to log
     * @example
     * Pass any number of arguments to log
     * ```ts
     * logger.error("Major error", error, 123)
     * ```
     */
    error: (title: unknown, ...args: unknown[]) => {
        if (["trace", "debug", "info", "warn", "error"].includes(LOG_LEVEL)) {
            console.error(
                red(`${prefix()}⚠️ ${underline("ERROR")} >`),
                title,
            )
            args.forEach((arg) => {
                formatArg(arg).split("\n").forEach((line) => {
                    console.error("   ", line)
                })
            })
        }
    },
    /**
     * Log a message to the console with the trace level.
     * Is only logged if the log level is set to trace, debug, info, or warn
     * @param args - The arguments to log
     * @example
     * Pass any number of arguments to log
     * ```ts
     * logger.log("Warning, this happened", unimportantError, 123)
     * ```
     */
    warn: (title: unknown, ...args: unknown[]) => {
        if (["trace", "debug", "info", "warn"].includes(LOG_LEVEL)) {
            console.warn(
                yellow(`${prefix()}⚠ ${underline("WARN")} >`),
                title,
            )
            args.forEach((arg) => {
                formatArg(arg).split("\n").forEach((line) => {
                    console.warn("   ", line)
                })
            })
        }
    },
    /**
     * Log a message to the console with the trace level.
     * Is only logged if the log level is set to trace, debug, or info
     * @param args - The arguments to log
     * @example
     * Pass any number of arguments to log
     * ```ts
     * logger.log("FYI", variable, 123)
     * ```
     */
    info: (title: unknown, ...args: unknown[]) => {
        if (["trace", "debug", "info"].includes(LOG_LEVEL)) {
            console.info(
                blue(`${prefix()}ℹ ${underline("INFO")} >`),
                title,
            )
            args.forEach((arg) => {
                formatArg(arg).split("\n").forEach((line) => {
                    console.info("   ", line)
                })
            })
        }
    },
    /**
     * Log a message to the console with the trace level.
     * Is only logged if the log level is set to trace or debug
     * @param args - The arguments to log
     * @example
     * Pass any number of arguments to log
     * ```ts
     * logger.log("This is what's happening", variable, 123)
     * ```
     */
    debug: (title: unknown, ...args: unknown[]) => {
        if (["trace", "debug"].includes(LOG_LEVEL)) {
            console.debug(
                magenta(`${prefix()}🐞 ${underline("DEBUG")} >`),
                title,
            )
            args.forEach((arg) => {
                formatArg(arg).split("\n").forEach((line) => {
                    console.debug("   ", line)
                })
            })
        }
    },
    /**
     * Log a message to the console with the trace level.
     * Is only logged if the log level is set to trace
     * @param args - The arguments to log
     * @example
     * Pass any number of arguments to log
     * ```ts
     * logger.log("This is particularly bewildering", variable, 123)
     * ```
     */
    trace: (...args: unknown[]) => {
        if (["trace"].includes(LOG_LEVEL)) {
            console.trace(green(`${prefix()}>`), ...args)
        } else if (LOG_LEVEL === "debug") {
            console.trace(
                gray(
                    "[TRACE log level not enabled, remember to remove this trace call before production!]",
                ),
            )
        }
    },
}
