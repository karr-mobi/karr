import process from "node:process"
import { toInt } from "@karr/util"
import { env } from "std-env"
import { type ConfigFile, LogLevelSchema } from "../schema.js"
import { handleConfigError } from "./index.js"

//biome-ignore lint/complexity/noExcessiveCognitiveComplexity: I don't want to split this into smaller functions
export function readConfigFromEnv(): Partial<ConfigFile> {
    const config = {} as Partial<ConfigFile>

    if (env.APPLICATION_NAME) {
        config.APPLICATION_NAME = env.APPLICATION_NAME
    }

    if (env.APP_URL) {
        config.APP_URL = env.APP_URL
    }

    if (env.API_PORT) {
        config.API_PORT = toInt(env.API_PORT)
    }

    if (env.API_BASE) {
        config.API_BASE = env.API_BASE
    }

    if (env.LOG_TIMESTAMP) {
        config.LOG_TIMESTAMP = !(env.LOG_TIMESTAMP === "false")
    }

    if (env.LOG_LEVEL) {
        const parsed = LogLevelSchema.safeParse(env.LOG_LEVEL)

        if (!parsed.success) {
            handleConfigError(parsed.error)
            process.exit(1)
        }

        config.LOG_LEVEL = parsed.data
    }

    if (env.ADMIN_EMAIL) {
        config.ADMIN_EMAIL = env.ADMIN_EMAIL
    }

    if (env.FEDERATION) {
        config.FEDERATION = !(env.FEDERATION === "false")
    }

    // ====================
    // == Auth providers ==
    // ====================
    if (env.AUTH_PASSWORD) {
        config.AUTH_PROVIDERS ||= []
        config.AUTH_PROVIDERS.push({
            name: "password",
            trusted: !(env.AUTH_PASSWORD_TRUSTED === "false")
        })
    }

    if (env.AUTH_CODE) {
        config.AUTH_PROVIDERS ||= []
        config.AUTH_PROVIDERS.push({
            name: "code",
            trusted: !(env.AUTH_OIDC_TRUSTED === "false")
        })
    }

    if (env.AUTH_GITHUB_CLIENT_ID || env.AUTH_GITHUB_CLIENT_SECRET) {
        config.AUTH_PROVIDERS ||= []
        config.AUTH_PROVIDERS.push({
            name: "github",
            trusted: !(env.AUTH_OIDC_TRUSTED === "false"),
            clientID: env.AUTH_GITHUB_CLIENT_ID as string,
            clientSecret: env.AUTH_GITHUB_CLIENT_SECRET as string
        })
    }

    if (env.AUTH_GOOGLE_CLIENT_ID) {
        config.AUTH_PROVIDERS ||= []
        config.AUTH_PROVIDERS.push({
            name: "google",
            trusted: !(env.AUTH_OIDC_TRUSTED === "false"),
            clientID: env.AUTH_GOOGLE_CLIENT_ID as string
        })
    }

    // ===================
    // ==== DB config ====
    // ===================
    if (env.DB_HOST) {
        config.DB_CONFIG ||= {}
        config.DB_CONFIG.host = env.DB_HOST
    }

    if (env.DB_PORT) {
        config.DB_CONFIG ||= {}
        config.DB_CONFIG.port = toInt(env.DB_PORT)
    }

    if (env.DB_SSL) {
        config.DB_CONFIG ||= {}
        config.DB_CONFIG.ssl = !(env.DB_SSL === "false")
    }

    if (env.DB_NAME) {
        config.DB_CONFIG ||= {}
        config.DB_CONFIG.db_name = env.DB_NAME
    }

    if (env.DB_USER) {
        config.DB_CONFIG ||= {}
        config.DB_CONFIG.user = env.DB_USER
    }

    if (env.DB_PASSWORD) {
        config.DB_CONFIG ||= {}
        config.DB_CONFIG.password = env.DB_PASSWORD
    }

    if (env.DB_PASSWORD_FILE) {
        config.DB_CONFIG ||= {}
        config.DB_CONFIG.password_file = env.DB_PASSWORD_FILE
    }

    return config
}
