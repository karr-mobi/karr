import { getDbPasswordFromFile, readConfig } from "./importer.ts"
import { toInt } from "@util"

export const logLevels = ["trace", "debug", "info", "warn", "error"] as const
type LogLevel = typeof logLevels[number]

type DbConfig = {
    host: string
    port: number
    ssl: boolean
    name: string
    user: string
    password: string
    connStr: string
}

const userConfig = readConfig()

export const API_VERSION: string = "v1"
export const PRODUCTION: boolean = Deno.env.get("ENV") === "production"
export const PORT: number = toInt(Deno.env.get("PORT") || 3000)

export const LOG_LEVEL: LogLevel = <LogLevel> (Deno.env.get("LOG_LEVEL") || "info")
export const LOG_TIMESTAMP: boolean = (Deno.env.get("LOG_TIMESTAMP") || "true") === "true"
export const TZ: string = Deno.env.get("TZ") || "Europe/Paris"

export const DB_CONFIG: DbConfig = Object.freeze({
    host: Deno.env.get("DB_HOST") || userConfig.database.host || "localhost",
    port: toInt(Deno.env.get("DB_PORT") || userConfig.database.port || 5432),
    ssl: (Deno.env.get("DB_SSL") || "false") === "true",
    name: Deno.env.get("DB_NAME") || userConfig.database.database || "karr",
    user: Deno.env.get("DB_USER") || userConfig.database.username || "karr",

    // password can be set via DB_PASSWORD or DB_PASSWORD_FILE.
    // File is preferred if it exists.
    password: (Deno.env.get("DB_PASSWORD_FILE")
        ? getDbPasswordFromFile(Deno.env.get("DB_PASSWORD_FILE"))
        : (Deno.env.get("DB_PASSWORD") || userConfig.database.password)) ||
        "karr",

    // the connection info as a string
    get connStr(): string {
        return `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`
    },
})

// ====================
// Instance parameters
// ====================
export const APPLICATION_NAME: string = Deno.env.get("APPLICATION_NAME") ||
    userConfig.application_name || "Karr"

export const ADMIN_EMAIL: string = Deno.env.get("ADMIN_EMAIL") ||
    userConfig.admin_email ||
    "admin@example.com"

export default {
    API_VERSION,
    PRODUCTION,
    PORT,
    LOG_LEVEL,
    LOG_TIMESTAMP,
    TZ,
    DB_CONFIG,
    APPLICATION_NAME,
    ADMIN_EMAIL,
}
