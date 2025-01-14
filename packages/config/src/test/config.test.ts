import { existsSync, readFileSync } from "node:fs"
import { loadConfig } from "c12"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import defaultConfig from "@/default_config.json" with { type: "json" }
import { FullConfigSchema } from "@/schema.js"
import staticConfig from "@/static.js"

// Mock the filesystem modules
vi.mock("node:fs", () => ({
    existsSync: vi.fn(),
    readFileSync: vi.fn()
}))

// Mock c12's loadConfig
vi.mock("c12", () => ({
    loadConfig: vi.fn()
}))

describe("config module", () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks()
        // Reset modules before each test
        vi.resetModules()

        // Set up default mock implementation
        vi.mocked(loadConfig).mockResolvedValue({ config: defaultConfig })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it("named exports should pass FullConfigSchema", async () => {
        const importedConfig = await import("@/config.js")
        const result = FullConfigSchema.safeParse(importedConfig.default)
        expect(result.success).toBe(true)

        if (!result.success) {
            console.error(result.error.issues)
        }
    })

    it("should load default config when no config file exists", async () => {
        // Setup loadConfig to return default config
        vi.mocked(loadConfig).mockResolvedValue({ config: defaultConfig })

        // Import the module under test
        const config = (await import("@/config.js")).default

        // Verify loadConfig was called with correct parameters
        expect(loadConfig).toHaveBeenCalledWith({
            cwd: "../../config",
            configFile: "karr.config",
            defaultConfig,
            rcFile: false,
            globalRc: false,
            packageJson: false
        })

        expect(config.APPLICATION_NAME).toBe(staticConfig.APPLICATION_NAME)
        expect(config.API_VERSION).toBe(staticConfig.API_VERSION)
        expect(config.API_PORT).toBe(defaultConfig.API_PORT)
        expect(config.LOG_LEVEL).toBe(defaultConfig.LOG_LEVEL)
        expect(config.LOG_TIMESTAMP).toBe(defaultConfig.LOG_TIMESTAMP)
        expect(config.PRODUCTION).toBe(process.env.NODE_ENV === "production")

        // DB config should not be included in full config
        expect(Object.keys(config).includes("DB_CONFIG")).toBe(false)

        expect(config.ADMIN_EMAIL).toBe(undefined)
    })

    it("should load and merge custom config file values", async () => {
        const customConfig = {
            ...defaultConfig,
            API_PORT: 4000,
            LOG_LEVEL: "debug"
        }

        // Setup loadConfig to return custom config
        vi.mocked(loadConfig).mockResolvedValue({ config: customConfig })

        // Import the module under test
        const config = (await import("@/config.js")).default

        // Verify custom values are present
        expect(config.API_PORT).toBe(4000)
        expect(config.LOG_LEVEL).toBe("debug")
    })

    describe("getDbConfig", () => {
        beforeEach(() => {
            // Clear any DB-related environment variables before each test
            delete process.env.DB_HOST
            delete process.env.DB_PORT
            delete process.env.DB_NAME
            delete process.env.DB_USER
            delete process.env.DB_PASSWORD
            delete process.env.DB_PASSWORD_FILE
        })

        it("should load database config from environment variables", async () => {
            vi.mocked(loadConfig).mockResolvedValue({ config: defaultConfig })

            // Set environment variables
            process.env.DB_HOST = "test-host"
            process.env.DB_PORT = "5432"
            process.env.DB_NAME = "test-db"
            process.env.DB_USER = "test-user"
            process.env.DB_PASSWORD = "test-pass"

            const { getDbConfig } = await import("@/config.js")
            const dbConfig = getDbConfig()

            expect(dbConfig).toMatchObject({
                host: "test-host",
                port: 5432, // Note: this should be a number
                name: "test-db",
                user: "test-user",
                password: "test-pass"
            })
        })

        it("should load database password from file when specified", async () => {
            const passwordFile = "/path/to/password"
            const password = "secret-password"

            vi.mocked(existsSync).mockReturnValue(true)
            vi.mocked(readFileSync).mockReturnValue(password)

            vi.mocked(loadConfig).mockResolvedValue({
                config: {
                    ...defaultConfig,
                    DB_CONFIG: {
                        host: "localhost",
                        port: 5432,
                        db_name: "testdb",
                        user: "testuser",
                        password_file: passwordFile
                    }
                }
            })

            // Ensure no environment variables interfere
            delete process.env.DB_PASSWORD
            delete process.env.DB_PASSWORD_FILE

            const { getDbConfig } = await import("@/config.js")
            const dbConfig = getDbConfig()

            expect(existsSync).toHaveBeenCalledWith(passwordFile)
            expect(readFileSync).toHaveBeenCalledWith(passwordFile, {
                encoding: "utf8",
                flag: "r"
            })
            expect(dbConfig.password).toBe(password)
        })

        it("should generate correct connection string", async () => {
            vi.mocked(loadConfig).mockResolvedValue({
                config: {
                    ...defaultConfig,
                    DB_CONFIG: {
                        host: "localhost",
                        port: 5432,
                        db_name: "testdb",
                        user: "testuser",
                        password: "testpass"
                    }
                }
            })

            const { getDbConfig } = await import("@/config.js")
            const dbConfig = getDbConfig()

            expect(dbConfig.connStr).toBe(
                "postgres://testuser:testpass@localhost:5432/testdb"
            )
        })
    })

    describe("exported config values", () => {
        it("should export individual config values", async () => {
            const expectedConfig = {
                API_PORT: 3000,
                LOG_TIMESTAMP: true,
                LOG_LEVEL: "info",
                API_VERSION: "v1",
                APPLICATION_NAME: "karr",
                PRODUCTION: false
            }

            vi.mocked(loadConfig).mockResolvedValue({ config: expectedConfig })

            const {
                API_PORT,
                LOG_TIMESTAMP,
                LOG_LEVEL,
                API_VERSION,
                APPLICATION_NAME,
                PRODUCTION
            } = await import("@/config.js")

            expect(API_PORT).toBe(expectedConfig.API_PORT)
            expect(LOG_TIMESTAMP).toBe(expectedConfig.LOG_TIMESTAMP)
            expect(LOG_LEVEL).toBe(expectedConfig.LOG_LEVEL)
            expect(API_VERSION).toBe(expectedConfig.API_VERSION)
            expect(APPLICATION_NAME).toBe(expectedConfig.APPLICATION_NAME)
            expect(PRODUCTION).toBe(expectedConfig.PRODUCTION)
        })
    })
})
