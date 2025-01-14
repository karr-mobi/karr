import { describe, expect, it } from "vitest"

import { isUUIDv4, toCamelCase } from "@/utilities.js"

describe("toCamelCase", () => {
    it("should return a given string in camel case", () => {
        expect(toCamelCase("Hello World")).toBe("helloWorld")
        expect(toCamelCase("helloWorld")).toBe("helloWorld")
        expect(toCamelCase("HelloWorld")).toBe("helloWorld")
    })
})

describe("isUUIDv4", () => {
    it("should return true for valid UUIDv4 strings", () => {
        expect(isUUIDv4("123e4567-e89b-12d3-a456-426614174000")).toBe(true)
        expect(isUUIDv4("987fcdeb-51a2-4321-b987-654321abcdef")).toBe(true)
        expect(isUUIDv4("550e8400-e29b-41d4-a716-446655440000")).toBe(true)
    })

    it("should return false for invalid UUIDv4 strings", () => {
        // Wrong format
        expect(isUUIDv4("not-a-uuid")).toBe(false)
        expect(isUUIDv4("123456789")).toBe(false)

        // Missing parts
        expect(isUUIDv4("123e4567-e89b-12d3-a456")).toBe(false)

        // Wrong separators
        expect(isUUIDv4("123e4567_e89b_12d3_a456_426614174000")).toBe(false)

        // Invalid characters
        expect(isUUIDv4("123e4567-e89b-12d3-a456-42661417400g")).toBe(false)

        // Empty string
        expect(isUUIDv4("")).toBe(false)

        // Wrong length
        expect(isUUIDv4("123e4567-e89b-12d3-a456-4266141740000")).toBe(false)
    })
})
