import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { parse } from "yaml"

import defaultConfig from "./default_config.json" with { type: "json" }

type Config = typeof defaultConfig

function resolvePath(file: string) {
    return join(process.cwd(), file)
}

const CONFIG_DIR = process.env.CONFIG_DIR || "../../config"

function parseFile(file: string = ".") {
    const filetype = file.split(".").pop()
    if (!filetype) {
        throw new Error("Invalid file type")
    }

    switch (filetype) {
        case "yaml":
        case "yml":
            return parse(readFileSync(file, { encoding: "utf8", flag: "r" }))
        case "json":
            return JSON.parse(
                readFileSync(file, { encoding: "utf8", flag: "r" })
            )
        default:
            throw new Error("Invalid file type")
    }
}

export function readConfig(): Config {
    const acceptedExtensions = ["yaml", "yml", "json"]

    for (const ext of acceptedExtensions) {
        const path = resolvePath(`${CONFIG_DIR}/karr_config.${ext}`)

        if (existsSync(path)) {
            const userConfig = parseFile(path)

            const filteredUserConfig = (
                Object.keys(userConfig) as Array<keyof typeof defaultConfig>
            )
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
    }

    console.error("No configuration file found")
    return defaultConfig
}

export function getDbPasswordFromFile(file: string): string | null {
    const path = file
    if (existsSync(path)) {
        return readFileSync(path, { encoding: "utf8", flag: "r" })
    }
    return null
}
