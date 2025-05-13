/*eslint-disable @typescript-eslint/no-explicit-any*/

import { describe, expect, it, test, vi } from "vitest"

import { lazy, type Prettify, toCamelCase, toInt } from "@/utilities.js"

describe("toCamelCase", () => {
    it("should return a given string in camel case", () => {
        expect(toCamelCase("Hello World")).toBe("helloWorld")
        expect(toCamelCase("helloWorld")).toBe("helloWorld")
        expect(toCamelCase("HelloWorld")).toBe("helloWorld")
    })

    it("should handle strings with underscores", () => {
        expect(toCamelCase("hello_world")).toBe("helloWorld")
        expect(toCamelCase("user_first_name")).toBe("userFirstName")
        expect(toCamelCase("_leading_underscore")).toBe("leadingUnderscore")
    })

    it("should handle mixed case with underscores", () => {
        expect(toCamelCase("Mixed_case_string")).toBe("mixedCaseString")
        expect(toCamelCase("UPPER_CASE")).toBe("upperCase")
        expect(toCamelCase("snake_case_string")).toBe("snakeCaseString")
    })

    it("should handle empty strings and edge cases", () => {
        expect(toCamelCase("")).toBe("")
        expect(toCamelCase("_")).toBe("")
        expect(toCamelCase("__")).toBe("")
        expect(toCamelCase("a_")).toBe("a")
        expect(toCamelCase("_a")).toBe("a")
    })
})

describe("toInt", () => {
    it("should return the same value when given a number", () => {
        expect(toInt(42)).toBe(42)
        expect(toInt(0)).toBe(0)
        expect(toInt(-10)).toBe(-10)
        expect(toInt(3.14)).toBe(3) // Rounds down
        expect(toInt(-2.7)).toBe(-3) // Rounds down
    })

    it("should convert valid string numbers to integers", () => {
        expect(toInt("42")).toBe(42)
        expect(toInt("0")).toBe(0)
        expect(toInt("-10")).toBe(-10)
        expect(toInt("  42  ")).toBe(42)
        expect(toInt("+123")).toBe(123) // Plus sign
        expect(toInt("007")).toBe(7) // Leading zeros
    })

    it("should handle float strings by truncating decimal part", () => {
        expect(toInt("3.14")).toBe(3)
        expect(toInt("-2.7")).toBe(-2)
        expect(toInt("0.999")).toBe(0)
    })

    it("doesn't handle scentific notation", () => {
        expect(toInt("1e2")).toBe(1)
        expect(toInt("1.5e2")).toBe(1)
    })

    it("should truncate trailling non-numeric characters", () => {
        expect(toInt("42abc")).toBe(42)
    })

    it("should throw an error for non-numeric strings", () => {
        expect(() => toInt("not a number")).toThrow()
        expect(() => toInt(""))
        expect(() => toInt(".5")).toThrow() // Decimal without leading zero
        expect(() => toInt("abc42")).toThrow()
        expect(() => toInt(" ")).toThrow()
    })

    it("should include a helpful error message", () => {
        try {
            toInt("invalid")
            expect.fail("Should have thrown an error")
            // biome-ignore lint/suspicious/noExplicitAny: this is a test
        } catch (error: any) {
            expect(error.message).toContain("is not a number")
            expect(error.message).toContain("HINT")
        }
    })
})

describe("lazy", () => {
    it("should only execute the getter function once", () => {
        let callCount = 0
        const lazyValue = lazy(() => {
            callCount++
            return "computed value"
        })

        expect(callCount).toBe(0) // Not called yet

        // First access
        expect(lazyValue.value).toBe("computed value")
        expect(callCount).toBe(1)

        // Second access
        expect(lazyValue.value).toBe("computed value")
        expect(callCount).toBe(1) // Still 1, not called again

        // Multiple additional accesses
        for (let i = 0; i < 10; i++) {
            expect(lazyValue.value).toBe("computed value")
        }
        expect(callCount).toBe(1) // Still 1, never called again
    })

    it("should memoize the computed value", () => {
        const object = { key: "original" }
        const lazyObject = lazy(() => object)

        const firstAccess = lazyObject.value

        // Modify the original object
        object.key = "modified"

        // The lazy value should reference the same object
        expect(lazyObject.value).toBe(firstAccess)
        expect(lazyObject.value.key).toBe("modified")
    })

    it("should work with different data types", () => {
        expect(lazy(() => 42).value).toBe(42)
        expect(lazy(() => "string").value).toBe("string")
        expect(lazy(() => true).value).toBe(true)
        expect(lazy(() => null).value).toBe(null)
        expect(lazy(() => undefined).value).toBe(undefined)

        const obj = { prop: "value" }
        expect(lazy(() => obj).value).toBe(obj)

        const arr = [1, 2, 3]
        expect(lazy(() => arr).value).toBe(arr)

        const date = new Date()
        expect(lazy(() => date).value).toBe(date)

        const map = new Map()
        expect(lazy(() => map).value).toBe(map)
    })

    it("should handle functions that throw errors", () => {
        const error = new Error("test error")
        const lazyError = lazy(() => {
            throw error
        })

        expect(() => lazyError.value).toThrow(error)

        // Should throw the same error on second attempt
        expect(() => lazyError.value).toThrow(error)
    })

    it("should allow complex computations", () => {
        const spy = vi.fn().mockImplementation(() => {
            return { computed: "result", timestamp: Date.now() }
        })

        const lazyComputed = lazy(spy)

        const result1 = lazyComputed.value
        expect(spy).toHaveBeenCalledTimes(1)

        const result2 = lazyComputed.value
        expect(spy).toHaveBeenCalledTimes(1)

        expect(result1).toBe(result2)
    })
})

// Type tests for Prettify
describe("Prettify type", () => {
    test("Prettify works with basic intersection types", () => {
        type A = { a: string }
        type B = { b: number }
        type Ab = A & B
        type PrettifiedAb = Prettify<Ab>

        // These are type-level tests that will be checked by TypeScript
        const testPrettified: PrettifiedAb = { a: "string", b: 42 }

        // Runtime assurance that the structure is correct
        expect(testPrettified).toEqual({ a: "string", b: 42 })
    })

    test("Prettify works with complex types", () => {
        type User = {
            id: number
            name: string
        }

        type UserWithRoles = User & {
            roles: string[]
            active: boolean
        }

        type PrettifiedUser = Prettify<UserWithRoles>

        const user: PrettifiedUser = {
            id: 1,
            name: "Test User",
            roles: ["admin", "user"],
            active: true
        } as UserWithRoles

        expect(user).toEqual({
            id: 1,
            name: "Test User",
            roles: ["admin", "user"],
            active: true
        })
    })

    test("Prettify preserves optional properties", () => {
        type WithOptional = {
            required: string
            optional?: number
        }

        type Extended = WithOptional & {
            extra: boolean
        }

        type PrettifiedWithOptional = Prettify<Extended>

        const withOptional: PrettifiedWithOptional = {
            required: "value",
            extra: true
        }

        const withBoth: PrettifiedWithOptional = {
            required: "value",
            optional: 42,
            extra: false
        }

        expect(withOptional.optional).toBeUndefined()
        expect(withBoth.optional).toBe(42)
    })
})
