import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { parseJSON, parseJSON5, parseYAML } from "confbox"

import defaultConfig from "./default_config.json" with { type: "json" }
import {
    ConfigFile,
    ConfigFileSchema,
    FullConfig,
    FullConfigSchema,
    LogLevelSchema
} from "./schema.js"
import { toInt } from "./utils.js"

const CONFIG_DIR = process.env.CONFIG_DIR || "../../config"
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
    if (base.startsWith("/")) {
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
        console.log(`Reading configuration from ${file}`)

        return file
    } else {
        console.error("No configuration file found")
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
        return ConfigFileSchema.parse(defaultConfig)
    }

    const userConfig = Object.assign(defaultConfig, parseFile(path))

    return ConfigFileSchema.parse(userConfig)
}

export function loadDbConfig(): ConfigFile {
    const config = readConfig()

    return ConfigFileSchema.parse(config)
}

export function loadFullConfig(): FullConfig {
    const config = readConfig()

    if (process.env.API_PORT) {
        config.API_PORT = toInt(process.env.API_PORT)
    }

    if (process.env.LOG_TIMESTAMP) {
        config.LOG_TIMESTAMP = !(process.env.LOG_TIMESTAMP === "false")
    }

    if (process.env.LOG_LEVEL) {
        config.LOG_LEVEL = LogLevelSchema.parse(process.env.LOG_LEVEL)
    }

    if (process.env.ADMIN_EMAIL) {
        config.ADMIN_EMAIL = process.env.ADMIN_EMAIL
    }

    return FullConfigSchema.parse(config)
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
