import { existsSync, readFileSync } from "node:fs"
import { loadConfig } from "c12"
import { z } from "zod"

import defaultConfig from "./default_config.json" with { type: "json" }
import { ConfigFile, FullConfig, FullConfigSchema, LogLevelSchema } from "./schema.js"
import { toInt } from "./utils.js"

const CONFIG_DIR = process.env.CONFIG_DIR || "../../config"
const CONFIG_FILENAME = process.env.CONFIG_FILE || "karr.config"

const { config: fileConfig } = await loadConfig<ConfigFile>({
    cwd: CONFIG_DIR,
    configFile: CONFIG_FILENAME,
    //@ts-expect-error config typescript typing is broken, works when parsed with zod
    defaultConfig,

    // Disable all other config loading strategies
    rcFile: false,
    globalRc: false,
    packageJson: false
})

if (process.env.API_PORT) {
    fileConfig.API_PORT = toInt(process.env.API_PORT)
}

if (process.env.LOG_TIMESTAMP) {
    fileConfig.LOG_TIMESTAMP = !(process.env.LOG_TIMESTAMP === "false")
}

if (process.env.LOG_LEVEL) {
    fileConfig.LOG_LEVEL = LogLevelSchema.parse(process.env.LOG_LEVEL)
}

if (process.env.ADMIN_EMAIL) {
    fileConfig.ADMIN_EMAIL = process.env.ADMIN_EMAIL
}

const config: FullConfig = FullConfigSchema.parse(fileConfig)

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
    return DbConfigSchema.parse(<DbConfig>{
        host: process.env.DB_HOST || fileConfig.DB_CONFIG?.host,
        port: toInt(process.env.DB_PORT || fileConfig.DB_CONFIG?.port || ""),
        ssl: process.env.DB_SSL || fileConfig.DB_CONFIG?.ssl || false,
        name: process.env.DB_NAME || fileConfig.DB_CONFIG?.db_name,
        user: process.env.DB_USER || fileConfig.DB_CONFIG?.user,
        password:
            process.env.DB_PASSWORD ||
            getDbPasswordFromFile(
                process.env.DB_PASSWORD_FILE || fileConfig.DB_CONFIG?.password_file
            ) ||
            fileConfig.DB_CONFIG?.password,
        get connStr(): string {
            return `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`
        }
    })
}

/**
 * Reads the database password from the specified file
 * @param path The path to the file
 * @returns The password, or null if the file does not exist
 */
function getDbPasswordFromFile(path: string | undefined): string | null {
    if (path && existsSync(path)) {
        return readFileSync(path, { encoding: "utf8", flag: "r" })
    }
    return null
}
