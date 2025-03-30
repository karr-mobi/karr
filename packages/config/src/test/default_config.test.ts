import { describe, expect, it } from "vitest"

import defaultConfig from "@/default_config.json" with { type: "json" }
import { ConfigFileSchema, FullConfigSchema } from "@/schema.js"
import { API_VERSION } from "@/static.js"

describe("default config", () => {
    it("should validate against ConfigFileSchema", () => {
        const result = ConfigFileSchema.safeParse(defaultConfig)
        // If you want to be more specific about errors when validation fails
        if (!result.success) {
            console.error(result.error.issues)
        }
        expect(result.success).toBe(true)
    })

    it("shouldn't validate against FullConfigSchema", () => {
        defaultConfig.API_BASE += API_VERSION
        const result = FullConfigSchema.omit({ APP_URL: true }).safeParse(defaultConfig)
        // If you want to be more specific about errors when validation fails
        if (!result.success) {
            console.error(result.error.issues)
        }
        expect(result.success).toBe(false)
    })
})
