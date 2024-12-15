import { parse } from "yaml"
//deno-lint-ignore no-external-import
import { dirname, join } from "node:path"
//deno-lint-ignore no-external-import
import { existsSync } from "node:fs"
//deno-lint-ignore no-external-import
import { fileURLToPath } from "node:url"
import { logger } from "@util"

import defaultConfig from "./default_config.json" with { type: "json" }

type Config = typeof defaultConfig

function resolvePath(file: string) {
    return join(dirname(fileURLToPath(import.meta.url)), file)
}

function parseFile(file: string = "../karr_config.yaml") {
    const filetype = file.split(".").pop()
    if (!filetype) {
        throw new Error("Invalid file type")
    }

    switch (filetype) {
        case "yaml":
        case "yml":
            return parse(Deno.readTextFileSync(file))
        case "json":
            return JSON.parse(Deno.readTextFileSync(file))
        default:
            throw new Error("Invalid file type")
    }
}

export function readConfig(): Config {
    const acceptedExtensions = ["yaml", "yml", "json"]

    for (const ext of acceptedExtensions) {
        const path = resolvePath(`../karr_config.${ext}`)

        if (existsSync(path)) {
            const userConfig = parseFile(path)

            const filteredUserConfig =
                (Object.keys(userConfig) as Array<keyof typeof defaultConfig>)
                    .filter((key) => key in defaultConfig)
                    .reduce((obj, key) => {
                        obj[key] = userConfig[key]
                        return obj
                    }, {} as typeof defaultConfig)

            return Object.assign(defaultConfig, filteredUserConfig)
        }
    }

    logger.error("No configuration file found")
    return defaultConfig
}

export function getDbPasswordFromFile(file: string): string | null {
    const path = file
    if (existsSync(path)) {
        return Deno.readTextFileSync(path)
    }
    return null
}

if (import.meta.main) {
    logger.info("Read config", readConfig())
}
