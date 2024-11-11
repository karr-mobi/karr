export const logLevels = ["trace", "debug", "info", "warn", "error"] as const
type LogLevel = typeof logLevels[number]

/**
 * Convert a string or number to an integer
 * @param value - The value to convert
 * @returns The integer value or undefined if the value is not a number
 * @throws If the value is not a number
 */
const toInt = (value: number | string): number => {
    if (typeof value === "number") {
        return value
    }
    const parsed = parseInt(value, 10)
    if (isNaN(parsed)) {
        throw new Error(
            `${value} is not a number \n \t\t\tHINT: likely an invalid environment variable`,
        )
    }
    return parsed
}

// ====================
// Configuration values
// ====================
export const API_VERSION: string = "v1"

export const PRODUCTION: boolean = Deno.env.get("ENV") === "production"

export const PORT: number = toInt(Deno.env.get("PORT") || 3000)

export const LOG_LEVEL: LogLevel = <LogLevel> (Deno.env.get("LOG_LEVEL") || "info")

export const LOG_TIMESTAMP: boolean = (Deno.env.get("LOG_TIMESTAMP") || "true") === "true"

export const TZ: string = Deno.env.get("TZ") || "Europe/Paris"

export const DB_CONFIG = Object.freeze({
    host: Deno.env.get("DB_HOST") || "localhost",
    port: toInt(Deno.env.get("DB_PORT") || 5432),
    ssl: (Deno.env.get("DB_SSL") || "false") === "true",
    name: Deno.env.get("DB_NAME") || "carpool",
    user: Deno.env.get("DB_USER") ||
        (PRODUCTION ? "carpool" : "postgres"),
    password: Deno.env.get("DB_PASS") || "password",

    // the connection info as a string
    get connStr(): string {
        return `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`
    },
})

// ====================
// Instance parameters
// ====================
export const ADMIN_EMAIL: string = Deno.env.get("ADMIN_EMAIL") || ""
