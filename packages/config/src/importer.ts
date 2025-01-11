import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { parse as yamlParse } from "yaml"

import defaultConfig from "./default_config.json" with { type: "json" }

export type ConfigFile = typeof defaultConfig

export const CONFIG_DIR = process.env.CONFIG_DIR || "../../config"
export const CONFIG_FILENAME = process.env.CONFIG_FILE || "karr_config"

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
export function resolveConfigPath(): string | undefined {
    const acceptedExtensions = ["yaml", "yml", "json"]

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
 * Valid extensions: .yaml, .yml, .json (in this order of precedence)
 * @param file The file to parse
 * @returns The parsed data
 * @throws {Error} If the file type is invalid, or if the file is not found
 */
function parseFile(file: string = ".") {
    const filetype = file.split(".").pop()
    if (!filetype) {
        throw new Error("Invalid file type")
    }

    switch (filetype) {
        case "yaml":
        case "yml":
            return yamlParse(readFileSync(file, { encoding: "utf8", flag: "r" }))
        case "json":
            return JSON.parse(readFileSync(file, { encoding: "utf8", flag: "r" }))
        default:
            throw new Error("Invalid file type")
    }
}

/**
 * Reads the config file and returns the parsed data
 * @returns The parsed data
 */
export function readConfig(): ConfigFile {
    const path = resolveConfigPath()

    if (!path) {
        return defaultConfig
    }

    const userConfig = parseFile(path)

    // remove keys that are not in the default config
    const filteredUserConfig = (Object.keys(userConfig) as Array<keyof ConfigFile>)
        .filter((key) => key in defaultConfig)
        .reduce(
            (obj, key) => {
                obj[key] = userConfig[key]
                return obj
            },
            {} as typeof defaultConfig
        )

    return Object.assign(defaultConfig, filteredUserConfig)
}

/**
 * Reads the database password from the specified file
 * @param path The path to the file
 * @returns The password, or null if the file does not exist
 */
export function getDbPasswordFromFile(path: string): string | null {
    if (existsSync(path)) {
        return readFileSync(path, { encoding: "utf8", flag: "r" })
    }
    return null
}
