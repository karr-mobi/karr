import { describe, expect, it } from "vitest"

import defaultConfig from "@/default_config.json" with { type: "json" }
import { ConfigFileSchema, FullConfigSchema } from "@/schema.js"

describe("default config", () => {
    it("should validate against ConfigFileSchema", () => {
        const result = ConfigFileSchema.safeParse(defaultConfig)
        // If you want to be more specific about errors when validation fails
        if (!result.success) {
            console.error(result.error.issues)
        }
        expect(result.success).toBe(true)
    })

    it("should validate against FullConfigSchema", () => {
        const result = FullConfigSchema.safeParse(defaultConfig)
        // If you want to be more specific about errors when validation fails
        if (!result.success) {
            console.error(result.error.issues)
        }
        expect(result.success).toBe(true)
    })
})
