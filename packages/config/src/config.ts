import type { Config, DbConfig } from "@karr/types"

import {
    getDbPasswordFromFile,
    readConfig,
    type ConfigFile
} from "./importer.js"

export const logLevels = ["trace", "debug", "info", "warn", "error"] as const
type LogLevel = (typeof logLevels)[number]

/**
 * Convert a string or number to an integer
 * @param value - The value to convert
 * @returns The integer value or undefined if the value is not a number
 * @throws If the value is not a number
 */
export function toInt(value: number | string): number {
    if (typeof value === "number") {
        return value
    }
    const parsed = parseInt(value, 10)
    if (isNaN(parsed)) {
        throw new Error(
            `${value} is not a number \n \t\t\tHINT: likely an invalid environment variable`
        )
    }
    return parsed
}

// ====================
// Cached config
// ====================
const CONFIG_CACHE_TTL = 5 * 60 * 1000 // 5 minute
let cachedConfig: Config = {} as Config
let cachedUserConfig: ConfigFile = {} as ConfigFile
let lastLoadTime: number

/**
 * Make the config, from config files, environment variables and defaults
 * @param cacheControl "only-cache" will only load the config if it has been cached. "no-cache" will force a config reload
 * @returns The config
 */
function loadConfig(cacheControl?: "only-cache" | "no-cache"): Config {
    if (
        cacheControl === "no-cache" ||
        Object.keys(cachedUserConfig).length === 0 ||
        Date.now() - lastLoadTime > CONFIG_CACHE_TTL
    ) {
        cachedUserConfig = readConfig()
    }

    const prod = (process.env.NODE_ENV || process.env.ENV) === "production"

    return Object.freeze(<Config>{
        PRODUCTION: prod,
        API_VERSION: "v1",
        API_PORT: toInt(process.env.PORT || 1993),

        LOG_LEVEL: <LogLevel>(
            (process.env.LOG_LEVEL || (prod ? "info" : "debug"))
        ),
        LOG_TIMESTAMP: (process.env.LOG_TIMESTAMP || "true") === "true",
        TZ: process.env.TZ || "Europe/Paris",

        DB_CONFIG: Object.freeze(<DbConfig>{
            host:
                process.env.DB_HOST ||
                cachedUserConfig.database.host ||
                "localhost",
            port: toInt(
                process.env.DB_PORT || cachedUserConfig.database.port || 5432
            ),
            ssl: (process.env.DB_SSL || "false") === "true",
            name:
                process.env.DB_NAME ||
                cachedUserConfig.database.database ||
                "karr",
            user:
                process.env.DB_USER ||
                cachedUserConfig.database.username ||
                "karr",

            // password can be set via DB_PASSWORD or DB_PASSWORD_FILE.
            // File is preferred if it exists.
            password: (() => {
                let pass: string = cachedUserConfig.database.password || "karr"
                const passwordFile =
                    process.env.DB_PASSWORD_FILE ||
                    cachedUserConfig.database.password_file
                if (passwordFile) {
                    pass = getDbPasswordFromFile(passwordFile) || pass
                } else if (process.env.DB_PASSWORD) {
                    pass = process.env.DB_PASSWORD
                }
                return pass
            })(),

            // the connection info as a string
            get connStr(): string {
                return `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`
            }
        }),

        // ====================
        // Instance parameters
        // ====================
        APPLICATION_NAME: ((): string => {
            return (
                process.env.APPLICATION_NAME ||
                cachedUserConfig.application_name ||
                "Karr"
            )
        })(),

        ADMIN_EMAIL: ((): string => {
            return (
                process.env.ADMIN_EMAIL ||
                cachedUserConfig.admin_email ||
                "admin@example.com"
            )
        })()
    })
}

/**
 * Get the config from the file system
 * @param invalidateCache "only-cache" will only load the config if it has been cached. "no-cache" will force a config reload
 * @returns The config
 */
export default function getAppConfig(
    cacheControl?: "only-cache" | "no-cache"
): Config {
    if (cacheControl === "only-cache") {
        return cachedConfig
    }

    if (
        cacheControl === "no-cache" ||
        Object.keys(cachedConfig).length === 0 ||
        Date.now() - lastLoadTime > CONFIG_CACHE_TTL // This is arbitrary, could also assume all changes revalidate cache
    ) {
        cachedConfig = loadConfig(cacheControl)
        lastLoadTime = Date.now()
    }

    return cachedConfig
}
