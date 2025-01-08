import { writeFileSync } from "node:fs"
import { stringify } from "yaml"

import type { Config } from "@karr/types"

import {
    CONFIG_DIR,
    CONFIG_FILENAME,
    resolveConfigPath,
    resolvePath
} from "./importer.js"

function stringifyConfig(
    config: Config,
    format: "yaml" | "yml" | "json" = "yaml"
): string {
    if (format === "yaml" || format === "yml") {
        return stringify(config, { indent: 4 })
    } else if (format === "json") {
        return JSON.stringify(config, null, 4)
    }
    throw new Error("Invalid format")
}

/**
 * Exports the config to a file
 * @param config The config to export
 */
export function saveConfigToFile(config: Config) {
    const path =
        resolveConfigPath() ||
        resolvePath(CONFIG_DIR, `${CONFIG_FILENAME}.yaml`)

    const format = path.split(".").pop()
    if (!format || !["yaml", "yml", "json"].includes(format)) {
        throw new Error("Invalid file type")
    }

    const yaml = stringifyConfig(config, format as "yaml" | "yml" | "json")

    console.log(`Writing configuration to ${path}`)

    writeFileSync(path, yaml)
}
