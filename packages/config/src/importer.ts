import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { parse } from "yaml"

import defaultConfig from "./default_config.json" with { type: "json" }

type Config = typeof defaultConfig

function resolvePath(base: string, file: string) {
    if (base.startsWith("/")) {
        return join(base, file)
    }
    if (base.startsWith(".") || base.charAt(0).match(/\w/)) {
        return join(process.cwd(), base, file)
    }
    throw new Error("Invalid base path")
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
        const path = resolvePath(CONFIG_DIR, `karr_config.${ext}`)

        //TODO: remove log line
        console.log(`Reading configuration from ${path}`)

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
