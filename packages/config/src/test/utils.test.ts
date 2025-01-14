import { describe, expect, it } from "vitest"

import { toInt } from "@/utils.js"

describe("toInt", () => {
    it("should return the same number when given a number", () => {
        expect(toInt(42)).toBe(42)
        expect(toInt(0)).toBe(0)
        expect(toInt(-10)).toBe(-10)
    })

    it("should convert string numbers to integers", () => {
        expect(toInt("42")).toBe(42)
        expect(toInt("0")).toBe(0)
        expect(toInt("-10")).toBe(-10)
        expect(toInt("12.34")).toBe(12)
        expect(toInt("12x12")).toBe(12) // JS stops parsing once it sees a non-character
    })

    it("should throw an error for invalid number strings", () => {
        expect(() => toInt("abc")).toThrow("abc is not a number")
        expect(() => toInt("")).toThrow(" is not a number")
    })
})
