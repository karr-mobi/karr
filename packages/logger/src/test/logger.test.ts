import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import c from "tinyrainbow"

const { cyan, green, red, yellow, blue, magenta, gray, underline } = c

// Define default config values
const DEFAULT_CONFIG = {
    LOG_LEVEL: "trace",
    LOG_TIMESTAMP: false,
    PRODUCTION: false
}

// Create a mock config to control test behavior
const mockConfig = { ...DEFAULT_CONFIG }

// Mock the config module
vi.mock("@karr/config", () => {
    return {
        get LOG_LEVEL() {
            return mockConfig.LOG_LEVEL
        },
        get LOG_TIMESTAMP() {
            return mockConfig.LOG_TIMESTAMP
        },
        get PRODUCTION() {
            return mockConfig.PRODUCTION
        }
    }
})

// Mock the console methods
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const r = (...args: any) => args.map((arg: any) => String(arg)).join(" ")
const mockConsole = {
    log: vi.fn(r),
    error: vi.fn(r),
    warn: vi.fn(r),
    info: vi.fn(r),
    debug: vi.fn(r),
    trace: vi.fn(r)
}

vi.spyOn(console, "log").mockImplementation(mockConsole.log)
vi.spyOn(console, "error").mockImplementation(mockConsole.error)
vi.spyOn(console, "warn").mockImplementation(mockConsole.warn)
vi.spyOn(console, "info").mockImplementation(mockConsole.info)
vi.spyOn(console, "debug").mockImplementation(mockConsole.debug)
vi.spyOn(console, "trace").mockImplementation(mockConsole.trace)

// Import logger AFTER mocking the config
import { logger, prefix } from "../index"

describe("logger", () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks()
        // Reset config to default values
        Object.assign(mockConfig, DEFAULT_CONFIG)
    })

    describe("prefix", () => {
        it("should return a string with caller info when not in production", () => {
            mockConfig.PRODUCTION = false
            const result = prefix()
            expect(result).toContain("dist/index.js:")
        })

        it("should include timestamp when LOG_TIMESTAMP is true", () => {
            mockConfig.LOG_TIMESTAMP = true
            mockConfig.PRODUCTION = false
            const result = prefix()
            expect(result).toMatch(
                /\[\d{2}\/\d{2}\/\d{4}, \d{1,2}:\d{2}:\d{2}\]/
            )
        })

        it("should not include timestamp when LOG_TIMESTAMP is false", () => {
            mockConfig.LOG_TIMESTAMP = false
            mockConfig.PRODUCTION = false
            const result = prefix()
            expect(result).not.toMatch(
                /\[\d{2}\/\d{2}\/\d{4}, \d{1,2}:\d{2}:\d{2}\]/
            )
        })

        it("should not include caller info when in production", () => {
            mockConfig.PRODUCTION = true
            const result = prefix()
            expect(result).not.toContain("logger.test.ts:")
        })
    })

    describe("log", () => {
        it("should print prefix followed by message", () => {
            const message = "Hello, world!"
            const expectedPrefix = prefix()
            logger.log(message)
            expect(mockConsole.log).toHaveBeenCalledWith(
                cyan(expectedPrefix + ">"),
                message
            )
        })

        it("should log multiple arguments", () => {
            const arg1 = "Hello"
            const arg2 = { name: "world" }
            const arg3 = 123
            const expectedPrefix = prefix()
            logger.log(arg1, arg2, arg3)
            expect(mockConsole.log).toHaveBeenCalledWith(
                cyan(expectedPrefix + ">"),
                arg1,
                arg2,
                arg3
            )
        })

        it("should not log when LOG_LEVEL is warn", () => {
            mockConfig.LOG_LEVEL = "warn"
            logger.log("Hello")
            expect(mockConsole.log).not.toHaveBeenCalled()
        })

        it("should not log when LOG_LEVEL is error", () => {
            mockConfig.LOG_LEVEL = "error"
            logger.log("Hello")
            expect(mockConsole.log).not.toHaveBeenCalled()
        })
    })

    describe("success", () => {
        it("should print formatted success message", () => {
            const title = "Operation completed"
            const expectedPrefix = prefix()
            logger.success(title)
            expect(mockConsole.log).toHaveBeenCalledWith(
                green(`${expectedPrefix}✅ ${underline("SUCCESS")} >`),
                title
            )
        })

        it("should format additional arguments on separate lines", () => {
            const title = "Operation completed"
            const data = { id: 123, name: "test" }
            logger.success(title, data)

            expect(mockConsole.log).toHaveBeenCalledWith(
                green(`${prefix()}✅ ${underline("SUCCESS")} >`),
                title
            )

            // Check that the formatted JSON was logged
            const formattedData = JSON.stringify(data, null, 2).split("\n")
            formattedData.forEach((line) => {
                expect(mockConsole.log).toHaveBeenCalledWith("   ", line)
            })
        })

        it("should log at all log levels", () => {
            const levels = ["trace", "debug", "info", "warn", "error"]

            for (const level of levels) {
                vi.clearAllMocks()
                mockConfig.LOG_LEVEL = level
                logger.success("Test")
                expect(mockConsole.log).toHaveBeenCalled()
            }
        })
    })

    describe("error", () => {
        it("should print formatted error message", () => {
            const title = "Something went wrong"
            const expectedPrefix = prefix()
            logger.error(title)
            expect(mockConsole.error).toHaveBeenCalledWith(
                red(`${expectedPrefix}⚠️ ${underline("ERROR")} >`),
                title
            )
        })

        it("should format additional arguments on separate lines", () => {
            const title = "Something went wrong"
            const error = new Error("Test error")
            logger.error(title, error)

            expect(mockConsole.error).toHaveBeenCalledWith(
                red(`${prefix()}⚠️ ${underline("ERROR")} >`),
                title
            )

            // Check that error was logged as JSON (Error objects stringify to '{}')
            expect(mockConsole.error).toHaveBeenCalledWith("   ", "{}")
        })

        it("should log at all log levels", () => {
            const levels = ["trace", "debug", "info", "warn", "error"]

            for (const level of levels) {
                vi.clearAllMocks()
                mockConfig.LOG_LEVEL = level
                logger.error("Test")
                expect(mockConsole.error).toHaveBeenCalled()
            }
        })
    })

    describe("warn", () => {
        it("should print formatted warning message", () => {
            const title = "This might be a problem"
            const expectedPrefix = prefix()
            logger.warn(title)
            expect(mockConsole.warn).toHaveBeenCalledWith(
                yellow(`${expectedPrefix}⚠ ${underline("WARN")} >`),
                title
            )
        })

        it("should format additional arguments on separate lines", () => {
            const title = "This might be a problem"
            const data = { id: 123, status: "warning" }
            logger.warn(title, data)

            expect(mockConsole.warn).toHaveBeenCalledWith(
                yellow(`${prefix()}⚠ ${underline("WARN")} >`),
                title
            )

            // Check that the formatted JSON was logged
            const formattedData = JSON.stringify(data, null, 2).split("\n")
            formattedData.forEach((line) => {
                expect(mockConsole.warn).toHaveBeenCalledWith("   ", line)
            })
        })

        it("should not log when LOG_LEVEL is error", () => {
            mockConfig.LOG_LEVEL = "error"
            logger.warn("Test")
            expect(mockConsole.warn).not.toHaveBeenCalled()
        })

        it("should log when LOG_LEVEL is warn, info, debug, or trace", () => {
            const levels = ["trace", "debug", "info", "warn"]

            for (const level of levels) {
                vi.clearAllMocks()
                mockConfig.LOG_LEVEL = level
                logger.warn("Test")
                expect(mockConsole.warn).toHaveBeenCalled()
            }
        })
    })

    describe("info", () => {
        it("should print formatted info message", () => {
            const title = "For your information"
            const expectedPrefix = prefix()
            logger.info(title)
            expect(mockConsole.info).toHaveBeenCalledWith(
                blue(`${expectedPrefix}ℹ ${underline("INFO")} >`),
                title
            )
        })

        it("should format additional arguments on separate lines", () => {
            const title = "For your information"
            const data = { id: 123, status: "active" }
            logger.info(title, data)

            expect(mockConsole.info).toHaveBeenCalledWith(
                blue(`${prefix()}ℹ ${underline("INFO")} >`),
                title
            )

            // Check that the formatted JSON was logged
            const formattedData = JSON.stringify(data, null, 2).split("\n")
            formattedData.forEach((line) => {
                expect(mockConsole.info).toHaveBeenCalledWith("   ", line)
            })
        })

        it("should not log when LOG_LEVEL is warn or error", () => {
            const levels = ["warn", "error"]

            for (const level of levels) {
                vi.clearAllMocks()
                mockConfig.LOG_LEVEL = level
                logger.info("Test")
                expect(mockConsole.info).not.toHaveBeenCalled()
            }
        })

        it("should log when LOG_LEVEL is info, debug, or trace", () => {
            const levels = ["trace", "debug", "info"]

            for (const level of levels) {
                vi.clearAllMocks()
                mockConfig.LOG_LEVEL = level
                logger.info("Test")
                expect(mockConsole.info).toHaveBeenCalled()
            }
        })
    })

    describe("debug", () => {
        it("should print formatted debug message", () => {
            const title = "Debug information"
            const expectedPrefix = prefix()
            mockConfig.LOG_LEVEL = "debug"
            logger.debug(title)
            expect(mockConsole.debug).toHaveBeenCalledWith(
                magenta(`${expectedPrefix}🐞 ${underline("DEBUG")} >`),
                title
            )
        })

        it("should format additional arguments on separate lines", () => {
            mockConfig.LOG_LEVEL = "debug"
            const title = "Debug information"
            const data = { id: 123, debug: true }
            logger.debug(title, data)

            expect(mockConsole.debug).toHaveBeenCalledWith(
                magenta(`${prefix()}🐞 ${underline("DEBUG")} >`),
                title
            )

            // Check that the formatted JSON was logged
            const formattedData = JSON.stringify(data, null, 2).split("\n")
            formattedData.forEach((line) => {
                expect(mockConsole.debug).toHaveBeenCalledWith("   ", line)
            })
        })

        it("should not log when LOG_LEVEL is info, warn, or error", () => {
            const levels = ["info", "warn", "error"]

            for (const level of levels) {
                vi.clearAllMocks()
                mockConfig.LOG_LEVEL = level
                logger.debug("Test")
                expect(mockConsole.debug).not.toHaveBeenCalled()
            }
        })

        it("should log when LOG_LEVEL is debug or trace", () => {
            const levels = ["trace", "debug"]

            for (const level of levels) {
                vi.clearAllMocks()
                mockConfig.LOG_LEVEL = level
                logger.debug("Test")
                expect(mockConsole.debug).toHaveBeenCalled()
            }
        })
    })

    describe("trace", () => {
        it("should print trace message", () => {
            mockConfig.LOG_LEVEL = "trace"
            const message = "Detailed trace info"
            const expectedPrefix = prefix()
            logger.trace(message)
            expect(mockConsole.trace).toHaveBeenCalledWith(
                green(`${expectedPrefix}>`),
                message
            )
        })

        it("should log multiple arguments", () => {
            mockConfig.LOG_LEVEL = "trace"
            const arg1 = "Trace"
            const arg2 = { details: "test" }
            const arg3 = 123
            const expectedPrefix = prefix()
            logger.trace(arg1, arg2, arg3)
            expect(mockConsole.trace).toHaveBeenCalledWith(
                green(`${expectedPrefix}>`),
                arg1,
                arg2,
                arg3
            )
        })

        it("should only log when LOG_LEVEL is trace", () => {
            mockConfig.LOG_LEVEL = "trace"
            logger.trace("Test")
            expect(mockConsole.trace).toHaveBeenCalled()

            // Other levels should not log the trace message
            const otherLevels = ["debug", "info", "warn", "error"]
            for (const level of otherLevels) {
                vi.clearAllMocks()
                mockConfig.LOG_LEVEL = level
                logger.trace("Test")
                expect(mockConsole.trace).not.toHaveBeenCalledWith(
                    expect.stringContaining(">"),
                    "Test"
                )
            }
        })

        it("should show a warning message when LOG_LEVEL is debug", () => {
            mockConfig.LOG_LEVEL = "debug"
            logger.trace("Test")
            expect(mockConsole.trace).toHaveBeenCalledWith(
                gray(
                    "[TRACE log level not enabled, remember to remove this trace call before production!]"
                )
            )
        })
    })
})
