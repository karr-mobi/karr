import { describe, expect, it } from "vitest"
import { tryCatch } from "@/trycatch.js"

describe("tryCatch", () => {
    it("should return success result with value when promise resolves", async () => {
        const mockValue = { data: "test" }
        const mockPromise = Promise.resolve(mockValue)

        const result = await tryCatch(mockPromise)

        expect(result.success).toBe(true)
        expect(result.value).toBe(mockValue)
        expect(result.error).toBe(null)
    })

    it("should return failure result with error when promise rejects", async () => {
        const mockError = new Error("Test error")
        const mockPromise = Promise.reject(mockError)

        const result = await tryCatch(mockPromise)

        expect(result.success).toBe(false)
        expect(result.value).toBe(null)
        expect(result.error).toBe(mockError)
    })

    it("should handle different error types", async () => {
        const customError = { message: "Custom error object", code: 500 }
        const mockPromise = Promise.reject(customError)

        const result = await tryCatch<unknown, typeof customError>(mockPromise)

        expect(result.success).toBe(false)
        expect(result.value).toBe(null)
        expect(result.error).toBe(customError)
    })

    it("should handle promises that resolve with undefined", async () => {
        const mockPromise = Promise.resolve(undefined)

        const result = await tryCatch(mockPromise)

        expect(result.success).toBe(true)
        expect(result.value).toBe(undefined)
        expect(result.error).toBe(null)
    })

    it("should handle promises that resolve with null", async () => {
        const mockPromise = Promise.resolve(null)

        const result = await tryCatch(mockPromise)

        expect(result.success).toBe(true)
        expect(result.value).toBe(null)
        expect(result.error).toBe(null)
    })

    it("should handle async functions that throw errors", async () => {
        const asyncFnWithError = async () => {
            throw new Error("Async function error")
        }

        const result = await tryCatch(asyncFnWithError())

        expect(result.success).toBe(false)
        expect(result.value).toBe(null)
        expect(result.error).toBeInstanceOf(Error)
        expect((result.error as Error).message).toBe("Async function error")
    })

    it("should properly handle promises that resolve with complex objects", async () => {
        const complexObject = {
            id: 123,
            nested: {
                array: [1, 2, 3],
                map: new Map([["key", "value"]])
            },
            fn: () => "function result"
        }

        const result = await tryCatch(Promise.resolve(complexObject))

        expect(result.success).toBe(true)
        expect(result.value).toBe(complexObject)
        expect(result.error).toBe(null)
    })
})
