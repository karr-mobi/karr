//biome-ignore-all lint/suspicious/noConsole: can't import logger here
//biome-ignore-all lint/style/useThrowOnlyError: throwing empty string to avoid stack trace, avoid using process.exit

import defu from "defu"
import { env, isBun, isCI, isDeno, isNode, isTest } from "std-env"
import c from "tinyrainbow"
import type { z } from "zod"
import defaultConfig from "../default-config.json" with { type: "json" }
import {
    type ConfigFile,
    ConfigFileSchema,
    type DbConfig,
    DbConfigSchema,
    type FullConfig,
    FullConfigSchema,
    requiredKeys
} from "../schema.js"
import { API_VERSION } from "../static.js"
import { readConfigFromEnv } from "./env.js"

const fsRuntime = isBun || isDeno || isNode

export async function loadDbConfig(): Promise<DbConfig> {
    let config = defaultConfig as ConfigFile

    // if available, load the config from the file
    if (fsRuntime) {
        const { readConfigFromFile } = await import("./file.js")
        const fileConfig = readConfigFromFile()
        config = defu(fileConfig, config)
    }

    // load the config from the env
    const envConfig = readConfigFromEnv()
    config = defu(envConfig, config)

    if (config.DB_CONFIG?.password_file) {
        delete config.DB_CONFIG.password
    }

    const parsed = ConfigFileSchema.safeParse(config)

    if (!parsed.success) {
        handleConfigError(parsed.error)
        throw ""
    }

    const dbConfig = (parsed.data.DB_CONFIG || {}) as DbConfig

    const parsedDbConfig = DbConfigSchema.safeParse({
        host: dbConfig.host,
        port: dbConfig.port,
        name: parsed.data.DB_CONFIG?.db_name || defaultConfig.DB_CONFIG.db_name,
        user: dbConfig.user,
        password: await getDbPassword(parsed.data),
        ssl: parsed.data.DB_CONFIG?.ssl || false,
        get connStr() {
            return `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`
        }
    } satisfies DbConfig)

    if (!parsedDbConfig.success) {
        handleConfigError(parsedDbConfig.error)
        throw ""
    }

    return parsedDbConfig.data
}

/**
 * Returns the database password from the env or the file
 * @param fileConfig The config from the file
 * @returns The database password
 */
export async function getDbPassword(
    fileConfig: ConfigFile
): Promise<string | undefined> {
    let passFromFile: string | undefined | null

    if (fsRuntime) {
        const { getDbPasswordFromFile } = await import("./file.js")
        passFromFile = getDbPasswordFromFile(
            env.DB_PASSWORD_FILE || fileConfig.DB_CONFIG?.password_file
        )
    }

    return passFromFile || env.DB_PASSWORD || fileConfig.DB_CONFIG?.password
}

/**
 * Returns the full config
 * @returns The full config
 */
export async function loadFullConfig(): Promise<FullConfig> {
    let config = defaultConfig as ConfigFile

    // if available, load the config from the file
    if (fsRuntime) {
        const { readConfigFromFile } = await import("./file.js")
        const fileConfig = readConfigFromFile()
        config = defu(fileConfig, config)
    }

    // load the config from the env
    const envConfig = readConfigFromEnv()
    config = defu(envConfig, config)

    // dedupe auth providers
    if (config.AUTH_PROVIDERS) {
        const authProviders = config.AUTH_PROVIDERS.reduce(
            (acc, provider) => {
                if (!acc.find((p) => p.name === provider.name)) {
                    acc.push(provider)
                }
                return acc
            },
            [] as NonNullable<ConfigFile["AUTH_PROVIDERS"]>
        )
        config.AUTH_PROVIDERS = authProviders
    }

    if (isCI && !isTest) {
        if (isCI && config.AUTH_PROVIDERS?.length === 0) {
            config.AUTH_PROVIDERS.push({
                name: "password"
            })
        }
        if (!config.APP_URL) {
            config.APP_URL = "http://build.time/"
        }
        if (!config.RESEND_API_KEY) {
            config.RESEND_API_KEY = "re_123"
        }
    }

    config.API_BASE += `/${API_VERSION}`

    //TODO: this is buggy in Production docker
    config.AUTH_ISSUER ??= new URL(
        `${config.API_BASE}/auth`,
        config.APP_URL
    ).href

    const parsed = FullConfigSchema.safeParse(config)

    if (!parsed.success) {
        handleConfigError(parsed.error)
        throw ""
    }

    return parsed.data
}

export function handleConfigError(error: z.core.$ZodError) {
    const errors = error.issues
    const numErrors = errors.length
    console.error(
        c.inverse(c.red(" Configuration error ")),
        c.red(`(${numErrors} issue${numErrors > 1 ? "s" : ""})`)
    )
    console.log()

    const fields = errors.map((error) => error.path.join("."))
    console.log(c.gray(c.bold("Fields:")))
    for (const field of fields) {
        const required: boolean = requiredKeys.includes(field)

        console.log(
            "    -",
            c.bold(field),
            required ? c.inverse(c.red("\t REQUIRED ")) : ""
        )
    }

    console.log()

    for (const e of errors) {
        console.log(
            c.bgWhiteBright(c.black(c.bold(` ${e.code?.toUpperCase()} `))),
            c.bold(e.path.join(".")),
            "-",
            e.message
        )

        console.log()
    }

    console.log(
        "Please visit",
        c.underline(
            "https://docs.karr.mobi/getting-started/configuration-reference"
        ),
        "for more information."
    )
    console.log()
}
