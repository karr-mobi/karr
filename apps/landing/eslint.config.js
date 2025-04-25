import { nextJsConfig } from "@karr/eslint-config/next-js"

const baseConfigs = Array.isArray(nextJsConfig) ? nextJsConfig : [nextJsConfig]

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    ...baseConfigs,

    {
        rules: {
            "no-restricted-imports": "off"
        }
    }
]
