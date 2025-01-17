import { z } from "zod"

import { getDbPasswordFromFile, loadDbConfig, loadFullConfig } from "./loader.js"
import { toInt } from "./utils.js"

const config = loadFullConfig()

export default config

export const {
    API_PORT,
    LOG_TIMESTAMP,
    LOG_LEVEL,
    ADMIN_EMAIL,
    API_VERSION,
    APPLICATION_NAME,
    PRODUCTION
} = config

export { logLevels } from "./schema.js"

// ====================================================================
// Database config
// ====================================================================

export const DbConfigSchema = z.object({
    host: z.string(),
    port: z.number(),
    ssl: z.boolean(),
    name: z.string(),
    user: z.string(),
    password: z.string().optional(),
    connStr: z.string()
})

export type DbConfig = z.infer<typeof DbConfigSchema>

/**
 * Returns the database config
 * @returns The database config
 */
export function getDbConfig(): DbConfig {
    const fileConfig = loadDbConfig()

    return DbConfigSchema.parse(<DbConfig>{
        host: process.env.DB_HOST || fileConfig.DB_CONFIG?.host || "localhost",
        port: toInt(process.env.DB_PORT || fileConfig.DB_CONFIG?.port || "5432"),
        ssl: process.env.DB_SSL || fileConfig.DB_CONFIG?.ssl || false,
        name: process.env.DB_NAME || fileConfig.DB_CONFIG?.db_name || "karr",
        user: process.env.DB_USER || fileConfig.DB_CONFIG?.user || "postgres",
        password:
            getDbPasswordFromFile(
                process.env.DB_PASSWORD_FILE || fileConfig.DB_CONFIG?.password_file
            ) ||
            process.env.DB_PASSWORD ||
            fileConfig.DB_CONFIG?.password,
        get connStr(): string {
            return `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`
        }
    })
}
