// deno-lint-ignore-file no-console -- all logging behaviour is defined here

import chalk from "chalk"
import { logLevel, logTimestamp, tz } from "./config.ts"

const prefix = () => {
    const now = new Date().toLocaleString("en-GB", {
        timeZone: tz,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
    return logTimestamp ? `[${now}] ` : ""
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
        if (["trace", "debug", "info"].includes(logLevel)) {
            console.log(chalk.cyan(`${prefix()}>`), ...args)
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
        if (["trace", "debug", "info", "warn", "error"].includes(logLevel)) {
            console.error(
                chalk.red(`${prefix()}⚠️`, chalk.underline("ERROR"), ">"),
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
        if (["trace", "debug", "info", "warn"].includes(logLevel)) {
            console.warn(
                chalk.yellow(`${prefix()}⚠`, chalk.underline("WARN"), ">"),
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
        if (["trace", "debug", "info"].includes(logLevel)) {
            console.info(
                chalk.blue(`${prefix()}ℹ`, chalk.underline("INFO"), ">"),
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
        if (["trace", "debug"].includes(logLevel)) {
            console.debug(
                chalk.magenta(`${prefix()}🐞`, chalk.underline("DEBUG"), ">"),
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
        if (["trace"].includes(logLevel)) {
            console.trace(chalk.green(`${prefix()}>`), ...args)
        } else if (logLevel === "debug") {
            console.trace(
                chalk.gray(
                    "[TRACE log level not enabled, remember to remove this trace call before production!]",
                ),
            )
        }
    },
}
