type LogLevel = "trace" | "debug" | "info" | "warn" | "error"

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
export const production = Deno.env.get("ENV") === "production"

export const port: number = toInt(Deno.env.get("PORT") || 3000)

export const logLevel: LogLevel = <LogLevel> (Deno.env.get("LOG_LEVEL") || "info")

export const logTimestamp: boolean = (Deno.env.get("LOG_TIMESTAMP") || "true") === "true"

export const tz = Deno.env.get("TZ") || "Europe/Paris"

export const db = {
    host: Deno.env.get("DB_HOST") || "localhost",
    port: toInt(Deno.env.get("DB_PORT") || 5432),
    ssl: (Deno.env.get("DB_SSL") || "false") === "true",
    name: Deno.env.get("DB_NAME") || "carpool",
    user: Deno.env.get("DB_USER") ||
        (production ? "carpool" : "carpool_dev"),
    password: Deno.env.get("DB_PASS") || "carpool",
}
