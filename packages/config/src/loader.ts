import { existsSync, readFileSync } from "node:fs"
import { isAbsolute, join } from "node:path"
import { parseJSON, parseJSON5, parseYAML } from "confbox"
import c from "tinyrainbow"

import defaultConfig from "./default_config.json" with { type: "json" }
import {
    ConfigFile,
    ConfigFileSchema,
    FullConfig,
    FullConfigSchema,
    LogLevelSchema,
    requiredKeys
} from "./schema.js"
import { toInt } from "./utils.js"
import { API_VERSION } from "./static.js"
import { ZodIssue } from "zod"

const CONFIG_DIR =
    process.env.CONFIG_DIR ||
    (process.env.DOCKER === "1"
        ? "/app/config"
        : join(process.cwd(), "..", "..", "config"))
const CONFIG_FILENAME = process.env.CONFIG_FILE || "karr.config"

/**
 * Resolves a path relative to the base path
 * @param base The base path
 * @param file The file to resolve
 * @returns The resolved path
 * @example
 * ```ts
 * resolvePath("/home/user", "karr_config") -> "/home/user/karr_config"
 * resolvePath(".", "karr_config") -> "./karr_config" (as an absolute path)
 * resolvePath("../", "karr_config") -> "../karr_config" (as an absolute path)
 * resolvePath("config", "karr_config") -> "config/karr_config"
 * ```
 * @throws {Error} If the base path starts with anythinng other than "/", "." or a character
 */
function resolvePath(base: string, file: string): string {
    if (isAbsolute(base)) {
        return join(base, file)
    }
    if (base.startsWith(".") || base.charAt(0).match(/\w/)) {
        return join(process.cwd(), base, file)
    }
    throw new Error("Invalid base path")
}

/**
 * Resolves the path to the config file
 * If the config file is not found, it returns undefined
 * Valid extensions: .yaml, .yml, .json (in this order of precedence)
 * @param base The base path
 * @returns The path to the config file, or undefined if none found
 */
function resolveConfigPath(): string | undefined {
    const acceptedExtensions = ["yaml", "yml", "json5", "json"]

    const fileWithoutExt = resolvePath(CONFIG_DIR, CONFIG_FILENAME)

    const ext = acceptedExtensions.find((ext) => existsSync(`${fileWithoutExt}.${ext}`))

    if (ext) {
        const file = `${fileWithoutExt}.${ext}`

        //TODO: remove log line
        console.log(c.gray(`Reading configuration from ${file}`))

        return file
    } else {
        return undefined
    }
}

/**
 * Parses a file and returns the parsed data
 * Valid extensions: .yaml, .yml, .json5, .json (in this order of precedence)
 * @param file The file to parse
 * @returns The parsed data
 * @throws {Error} If the file type is invalid, or if the file is not found
 */
function parseFile(file: string = ".") {
    const filetype = file.split(".").pop()
    if (!filetype) {
        throw new Error("Invalid file type")
    }

    let filecontent: ConfigFile

    switch (filetype) {
        case "yaml":
        case "yml":
            filecontent = parseYAML<ConfigFile>(
                readFileSync(file, { encoding: "utf8", flag: "r" })
            )
            break
        case "json5":
            filecontent = parseJSON5<ConfigFile>(
                readFileSync(file, { encoding: "utf8", flag: "r" })
            )
            break
        case "json":
            filecontent = parseJSON<ConfigFile>(
                readFileSync(file, { encoding: "utf8", flag: "r" })
            )
            break
        default:
            throw new Error("Invalid file type")
    }

    return filecontent
}

/**
 * Reads the config file and returns the parsed data
 * @returns The parsed data
 */
function readConfig(): ConfigFile {
    const path = resolveConfigPath()

    if (!path) {
        // Warn the user that no config file was found
        console.log(
            c.inverse(c.bold(c.yellow(" ! WARNING "))),
            c.yellow("No configuration file found"),
            "\n"
        )
        return ConfigFileSchema.parse(defaultConfig)
    }

    // In development, default to trace log level
    if (!(process.env.NODE_ENV === "production" || process.env.DOCKER)) {
        defaultConfig.LOG_LEVEL = "trace"
    }

    const userConfig = Object.assign(defaultConfig, parseFile(path))

    const parsed = ConfigFileSchema.safeParse(userConfig)

    if (!parsed.success) {
        handleConfigError(parsed.error.issues)
        process.exit(1)
    }

    return parsed.data
}

export function loadDbConfig(): ConfigFile {
    const config = readConfig()

    const parsed = ConfigFileSchema.safeParse(config)

    if (!parsed.success) {
        handleConfigError(parsed.error.issues)
        process.exit(1)
    }

    return parsed.data
}

export function loadFullConfig(): FullConfig {
    const config = readConfig()

    if (process.env.APPLICATION_NAME) {
        config.APPLICATION_NAME = process.env.APPLICATION_NAME
    }

    if (process.env.APP_URL) {
        config.APP_URL = process.env.APP_URL
    }

    if (process.env.API_PORT) {
        config.API_PORT = toInt(process.env.API_PORT)
    }

    if (process.env.API_BASE) {
        config.API_BASE = process.env.API_BASE
    }

    if (process.env.LOG_TIMESTAMP) {
        config.LOG_TIMESTAMP = !(process.env.LOG_TIMESTAMP === "false")
    }

    if (process.env.LOG_LEVEL) {
        const parsed = LogLevelSchema.safeParse(process.env.LOG_LEVEL)

        if (!parsed.success) {
            handleConfigError(parsed.error.issues)
            process.exit(1)
        }

        config.LOG_LEVEL = parsed.data
    }

    if (process.env.ADMIN_EMAIL) {
        config.ADMIN_EMAIL = process.env.ADMIN_EMAIL
    }

    if (process.env.FEDERATION) {
        config.FEDERATION = !(process.env.LOG_TIMESTAMP === "false")
    }

    if (process.env.FEDERATION_TARGETS) {
        config.FEDERATION_TARGETS = process.env.FEDERATION_TARGETS.split(",").map(
            (target) => ({
                name: target,
                url: target
            })
        )
    }

    config.API_BASE += config.API_BASE?.endsWith("/") ? "/" : "" + API_VERSION

    const parsed = FullConfigSchema.safeParse(config)

    if (!parsed.success) {
        handleConfigError(parsed.error.issues)
        process.exit(1)
    }

    return parsed.data
}

/**
 * Reads the database password from the specified file
 * @param path The path to the file
 * @returns The password, or null if the file does not exist
 */
export function getDbPasswordFromFile(path: string | undefined): string | null {
    if (!path) return null

    const filepath = resolvePath(path, "")
    if (existsSync(filepath)) {
        return readFileSync(filepath, { encoding: "utf8", flag: "r" })
    }
    return null
}

export function handleConfigError(errors: ZodIssue[]) {
    const numErrors = errors.length
    const fields = errors.map((error) => error.path.join("."))
    console.error(
        c.inverse(c.red(" Configuration error ")),
        c.red(`(${numErrors} issue${numErrors > 1 ? "s" : ""})`)
    )
    console.log()
    console.log(c.gray(c.bold("Fields:")), c.bold(fields.join(", ")))

    console.log()

    for (const e of errors) {
        const required: boolean = requiredKeys.includes(e.path.join("."))
        console.log(
            c.bgWhiteBright(c.black(c.bold(` ${e.code.toUpperCase()} `))),
            c.bold(e.path.join(".")),
            "-",
            e.message,
            required ? c.inverse(c.red(" REQUIRED ")) : ""
        )

        //@ts-expect-error - expected and received are not always present
        if (e.expected && e.received) {
            //@ts-expect-error - expected and received are not always present
            console.log("\t", "+ Expected:", c.green(e.expected))
            //@ts-expect-error - expected and received are not always present
            console.log("\t", "- Received:", c.red(e.received))
        }

        console.log()
    }
}
