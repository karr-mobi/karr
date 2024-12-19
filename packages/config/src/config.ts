import { getDbPasswordFromFile, readConfig } from "./importer.js"

export const logLevels = ["trace", "debug", "info", "warn", "error"] as const
type LogLevel = (typeof logLevels)[number]

type DbConfig = {
    host: string
    port: number
    ssl: boolean
    name: string
    user: string
    password: string
    connStr: string
}

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

const userConfig = readConfig()

export const API_VERSION: string = "v1"
export const PRODUCTION: boolean =
    (process.env.NODE_ENV || process.env.ENV) === "production"
export const PORT: number = toInt(process.env.PORT || 1993)

export const LOG_LEVEL: LogLevel = <LogLevel>(process.env.LOG_LEVEL || "info")
export const LOG_TIMESTAMP: boolean =
    (process.env.LOG_TIMESTAMP || "true") === "true"
export const TZ: string = process.env.TZ || "Europe/Paris"

export const DB_CONFIG: DbConfig = Object.freeze({
    host: process.env.DB_HOST || userConfig.database.host || "localhost",
    port: toInt(process.env.DB_PORT || userConfig.database.port || 5432),
    ssl: (process.env.DB_SSL || "false") === "true",
    name: process.env.DB_NAME || userConfig.database.database || "karr",
    user: process.env.DB_USER || userConfig.database.username || "karr",

    // password can be set via DB_PASSWORD or DB_PASSWORD_FILE.
    // File is preferred if it exists.
    password:
        (process.env.DB_PASSWORD_FILE
            ? getDbPasswordFromFile(process.env.DB_PASSWORD_FILE)
            : process.env.DB_PASSWORD || userConfig.database.password) ||
        "karr",

    // the connection info as a string
    get connStr(): string {
        return `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`
    }
})

// ====================
// Instance parameters
// ====================
export const APPLICATION_NAME: string =
    process.env.APPLICATION_NAME || userConfig.application_name || "Karr"

export const ADMIN_EMAIL: string =
    process.env.ADMIN_EMAIL || userConfig.admin_email || "admin@example.com"

export default {
    API_VERSION,
    PRODUCTION,
    PORT,
    LOG_LEVEL,
    LOG_TIMESTAMP,
    TZ,
    DB_CONFIG,
    APPLICATION_NAME,
    ADMIN_EMAIL
}
