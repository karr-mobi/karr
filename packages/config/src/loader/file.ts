//biome-ignore-all lint/style/useThrowOnlyError: throwing empty string to avoid stack trace, avoid using process.exit

import { existsSync, readFileSync } from "node:fs"
import { isAbsolute, join } from "node:path"
import process from "node:process"
import { parseJSON, parseJSON5, parseYAML } from "confbox"
import defaultConfig from "../default-config.json" with { type: "json" }
import { type ConfigFile, ConfigFileSchema } from "../schema.js"
import { handleConfigError } from "./index.js"

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
export function resolvePath(base: string, file: string): string {
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
export function resolveConfigPath(): string | undefined {
    const acceptedExtensions = ["yaml", "yml", "json5", "json"]

    const fileWithoutExt = resolvePath(CONFIG_DIR, CONFIG_FILENAME)

    const ext = acceptedExtensions.find((ext) =>
        existsSync(`${fileWithoutExt}.${ext}`)
    )

    if (ext) {
        const file = `${fileWithoutExt}.${ext}`

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
export function parseFile(file = ".") {
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
export function readConfigFromFile(): ConfigFile {
    const path = resolveConfigPath()

    if (!path) {
        return ConfigFileSchema.parse(defaultConfig)
    }

    // In development, default to trace log level
    if (!(process.env.NODE_ENV === "production" || process.env.DOCKER)) {
        defaultConfig.LOG_LEVEL = "trace"
    }

    const userConfig = Object.assign(defaultConfig, parseFile(path))

    const parsed = ConfigFileSchema.safeParse(userConfig)

    if (!parsed.success) {
        handleConfigError(parsed.error)
        throw ""
    }

    return parsed.data
}

/**
 * Reads the database password from the specified file
 * @param path The path to the file
 * @returns The password, or null if the file does not exist
 */
export function getDbPasswordFromFile(path: string | undefined) {
    if (!path) return null

    const filepath = resolvePath(path, "")
    if (existsSync(filepath)) {
        return readFileSync(filepath, { encoding: "utf8", flag: "r" })
    }
    return null
}
