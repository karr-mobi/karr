import { z } from "zod"

import {
    getDbPasswordFromFile,
    handleConfigError,
    loadDbConfig,
    loadFullConfig
} from "./loader.js"
import { lazy, toInt } from "@karr/util"

const config = lazy(() => loadFullConfig())

export default config.value

export const {
    APP_URL,
    API_PORT,
    API_BASE,
    LOG_TIMESTAMP,
    LOG_LEVEL,
    ADMIN_EMAIL,
    AUTH_PROVIDERS,
    FEDERATION,
    FEDERATION_TARGETS,
    APPLICATION_NAME,
    PRODUCTION
} = config.value

export { logLevels } from "./schema.js"
export type { AuthProvider } from "./schema.js"

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

    const parsed = DbConfigSchema.safeParse(<DbConfig>{
        host: process.env.DB_HOST || fileConfig.DB_CONFIG?.host || "localhost",
        port: toInt(
            process.env.DB_PORT || fileConfig.DB_CONFIG?.port || "5432"
        ),
        ssl: process.env.DB_SSL || fileConfig.DB_CONFIG?.ssl || false,
        name: process.env.DB_NAME || fileConfig.DB_CONFIG?.db_name || "karr",
        user: process.env.DB_USER || fileConfig.DB_CONFIG?.user || "postgres",
        password:
            getDbPasswordFromFile(
                process.env.DB_PASSWORD_FILE ||
                    fileConfig.DB_CONFIG?.password_file
            ) ||
            process.env.DB_PASSWORD ||
            fileConfig.DB_CONFIG?.password,
        get connStr(): string {
            return `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`
        }
    })

    if (!parsed.success) {
        handleConfigError(parsed.error)
        process.exit(1)
    }

    return parsed.data
}
