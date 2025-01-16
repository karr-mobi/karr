import { existsSync, readFileSync } from "node:fs"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import defaultConfig from "@/default_config.json" with { type: "json" }
import { getDbPasswordFromFile, loadDbConfig, loadFullConfig } from "@/loader.js"
import { ConfigFileSchema, FullConfigSchema } from "@/schema.js"
import staticConfig from "@/static.js"

// Mock modules at the top level
vi.mock("node:fs", () => ({
    existsSync: vi.fn(() => false),
    readFileSync: vi.fn()
}))

vi.mock("@/loader.js", () => ({
    loadFullConfig: vi.fn(() => defaultConfig),
    loadDbConfig: vi.fn(),
    getDbPasswordFromFile: vi.fn()
}))

function clearEnvVars() {
    const vars = [
        "DB_HOST",
        "DB_PORT",
        "DB_NAME",
        "DB_USER",
        "DB_PASSWORD",
        "DB_PASSWORD_FILE",
        "API_PORT",
        "ADMIN_EMAIL",
        "LOG_LEVEL",
        "LOG_TIMESTAMP",
        "NODE_ENV"
    ]
    vars.forEach((key) => delete process.env[key])
}

describe("config module", () => {
    beforeEach(() => {
        vi.resetModules()
        vi.clearAllMocks()
        clearEnvVars()

        // Reset mocks to default values
        vi.mocked(loadFullConfig).mockReturnValue(FullConfigSchema.parse(defaultConfig))
        vi.mocked(existsSync).mockReturnValue(false)
    })

    afterEach(() => {
        vi.clearAllMocks()
        clearEnvVars()
    })

    it("default export should pass FullConfigSchema", async () => {
        const { default: config } = await import("@/config.js")
        const result = FullConfigSchema.safeParse(config)
        expect(result.success).toBe(true)
    })

    it("should load default config when no config file exists", async () => {
        const { default: config } = await import("@/config.js")

        expect(config).toMatchObject({
            APPLICATION_NAME: staticConfig.APPLICATION_NAME,
            API_VERSION: staticConfig.API_VERSION,
            API_PORT: defaultConfig.API_PORT,
            LOG_LEVEL: defaultConfig.LOG_LEVEL,
            LOG_TIMESTAMP: defaultConfig.LOG_TIMESTAMP,
            PRODUCTION: false
        })

        expect(Object.keys(config)).not.toContain("DB_CONFIG")
        expect(config.ADMIN_EMAIL).toBeUndefined()
    })

    it("should load and merge custom config file values", async () => {
        const customConfig = FullConfigSchema.parse({
            ...defaultConfig,
            API_PORT: 4000,
            LOG_LEVEL: "debug"
        })

        vi.mocked(loadFullConfig).mockReturnValue(customConfig)

        const { default: config } = await import("@/config.js")

        expect(config.API_PORT).toBe(4000)
        expect(config.LOG_LEVEL).toBe("debug")
    })

    it("env-defineable fields should be overridden by env vars", async () => {
        process.env.API_PORT = "1337"
        process.env.LOG_LEVEL = "warn"

        const customConfig = FullConfigSchema.parse({
            ...defaultConfig,
            API_PORT: 1337,
            LOG_LEVEL: "warn"
        })

        vi.mocked(loadFullConfig).mockReturnValue(customConfig)

        const { default: config } = await import("@/config.js")

        expect(config.API_PORT).toBe(1337)
        expect(config.LOG_LEVEL).toBe("warn")
    })

    describe("getDbConfig", () => {
        it("should load database config from environment variables", async () => {
            // Set up environment variables
            process.env.DB_HOST = "test-host"
            process.env.DB_PORT = "5432"
            process.env.DB_NAME = "test-db"
            process.env.DB_USER = "test-user"
            process.env.DB_PASSWORD = "test-pass"

            // Mock loadDbConfig to return a basic config
            vi.mocked(loadDbConfig).mockReturnValue(
                FullConfigSchema.parse({
                    ...defaultConfig,
                    DB_CONFIG: {
                        host: "default-host",
                        port: 5432,
                        db_name: "default-db",
                        user: "default-user",
                        password: "default-pass",
                        ssl: false
                    }
                })
            )

            const { getDbConfig } = await import("@/config.js")
            const dbConfig = getDbConfig()

            expect(dbConfig).toMatchObject({
                host: "test-host",
                port: 5432,
                name: "test-db",
                user: "test-user",
                password: "test-pass",
                ssl: false,
                connStr: "postgres://test-user:test-pass@test-host:5432/test-db"
            })
        })

        it("should load database password from file when specified", async () => {
            const passwordFile = "/path/to/password"
            const password = "secret-password"

            // Mock file system calls
            vi.mocked(existsSync).mockReturnValue(true)
            vi.mocked(readFileSync).mockReturnValue(password)

            // Mock loadDbConfig with password file configuration
            vi.mocked(loadDbConfig).mockReturnValue(
                ConfigFileSchema.parse({
                    ...defaultConfig,
                    DB_CONFIG: {
                        host: "localhost",
                        port: 5432,
                        db_name: "testdb",
                        user: "testuser",
                        password_file: passwordFile,
                        ssl: false
                    }
                })
            )

            // Mock getDbPasswordFromFile
            // vi.mocked(getDbPasswordFromFile).mockReturnValue(password)

            const { getDbConfig } = await import("@/config.js")
            const dbConfig = getDbConfig()

            expect(dbConfig.password).toBe(password)
            expect(existsSync).toHaveBeenCalledWith(passwordFile)
            expect(readFileSync).toHaveBeenCalledWith(passwordFile, {
                encoding: "utf8",
                flag: "r"
            })

            // Verify the connection string
            expect(dbConfig.connStr).toBe(
                `postgres://testuser:${password}@localhost:5432/testdb`
            )
        })
    })

    describe("named exports", () => {
        it("should export individual config values", async () => {
            const expectedConfig = FullConfigSchema.parse({
                ...defaultConfig,
                API_PORT: 3000,
                LOG_TIMESTAMP: true,
                LOG_LEVEL: "info",
                API_VERSION: "v1",
                APPLICATION_NAME: "karr",
                PRODUCTION: false,
                ADMIN_EMAIL: "admin@example.com"
            })

            vi.mocked(loadFullConfig).mockReturnValue(expectedConfig)

            const {
                API_PORT,
                LOG_TIMESTAMP,
                LOG_LEVEL,
                API_VERSION,
                APPLICATION_NAME,
                PRODUCTION,
                ADMIN_EMAIL
            } = await import("@/config.js")

            expect(API_PORT).toBe(expectedConfig.API_PORT)
            expect(LOG_TIMESTAMP).toBe(expectedConfig.LOG_TIMESTAMP)
            expect(LOG_LEVEL).toBe(expectedConfig.LOG_LEVEL)
            expect(API_VERSION).toBe(expectedConfig.API_VERSION)
            expect(APPLICATION_NAME).toBe(expectedConfig.APPLICATION_NAME)
            expect(PRODUCTION).toBe(expectedConfig.PRODUCTION)
            expect(ADMIN_EMAIL).toBe(expectedConfig.ADMIN_EMAIL)
        })
    })
})
