import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { APP_VERSION } from "@/version.js"
import packageJson from "../../../../package.json" with { type: "json" }

describe("version", () => {
    // We don't need to manipulate import.meta for these tests
    beforeEach(() => {
        // Clear module cache if needed
        vi.resetModules()
    })

    afterEach(() => {
        // Cleanup if needed
    })

    it("should export the version from the root package.json", () => {
        expect(APP_VERSION).toBe(packageJson.version)
    })

    it("should match semantic versioning pattern", () => {
        // Semantic versioning pattern: MAJOR.MINOR.PATCH
        const semverPattern = /^\d+\.\d+\.\d+$/
        expect(APP_VERSION).toMatch(semverPattern)
    })

    it("should be a non-empty string", () => {
        expect(APP_VERSION).toBeTruthy()
        expect(typeof APP_VERSION).toBe("string")
    })
})
