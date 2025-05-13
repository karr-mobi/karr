import { describe, expect, it } from "vitest"

import defaultConfig from "@/default-config.json" with { type: "json" }
import { ConfigFileSchema, FullConfigSchema, requiredKeys } from "@/schema.js"
import { API_VERSION } from "@/static.js"

describe("default config", () => {
    it("should validate against ConfigFileSchema", () => {
        const result = ConfigFileSchema.safeParse(defaultConfig)
        // If you want to be more specific about errors when validation fails
        if (!result.success) {
            //biome-ignore lint/suspicious/noConsole: can't import logger here
            console.error(result.error.issues)
        }
        expect(result.success).toBe(true)
    })

    it("shouldn't validate against FullConfigSchema", () => {
        defaultConfig.API_BASE += `/${API_VERSION}`
        const result = FullConfigSchema.safeParse(defaultConfig)

        expect(result.success).toBe(false)

        const missingKeys = result.error?.issues.map((iss) => {
            return iss.path.join(".")
        })
        expect(missingKeys).toEqual(requiredKeys)
    })
})
