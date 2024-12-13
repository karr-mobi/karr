import { parse } from "@std/yaml"
import { dirname, fromFileUrl, join } from "@std/path"
import { existsSync } from "@std/fs"
import { logger, toCamelCase } from "@util"

import defaultConfig from "./default_config.json" with { type: "json" }

type Config = typeof defaultConfig

function resolvePath(file: string) {
    return join(dirname(fromFileUrl(import.meta.url)), file)
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

function camelCaseify(obj: Config) {
    return Object.keys(obj).reduce((acc: unknown, key: string) => {
        acc[toCamelCase(key)] = obj[key]
        return acc
    }, {} as Config)
}

export function readConfig() {
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

            return camelCaseify(Object.assign(defaultConfig, filteredUserConfig))
        }
    }

    logger.error("No configuration file found")
    return camelCaseify(defaultConfig)
}

export function getDbPasswordFromFile(file: string) {
    const path = file
    if (existsSync(path)) {
        return Deno.readTextFileSync(path)
    }
    return null
}

if (import.meta.main) {
    logger.info("Read config", readConfig())
}
