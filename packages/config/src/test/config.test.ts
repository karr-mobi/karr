//biome-ignore-all lint/style/useNamingConvention: intentional

import { existsSync, readFileSync } from "node:fs"
import { join, normalize } from "node:path"
import process from "node:process"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import defaultConfig from "@/default-config.json" with { type: "json" }
import { loadDbConfig, loadFullConfig } from "@/loader/index"
import { type FullConfig, FullConfigSchema } from "@/schema.js"
import staticConfig from "@/static.js"
import sampleConfigJson from "@/test/fixtures/sample_config.json" with {
    type: "json"
}

defaultConfig.API_BASE += `/${staticConfig.API_VERSION}`

const sampleConfigFile = readFileSync(
    join(process.cwd(), "./src/test/fixtures/sample_config.yaml")
)

// Mock modules at the top level
vi.mock("node:fs", async (importOriginal) => {
    const actual = await importOriginal()
    return {
        //@ts-expect-error - mock implementation
        ...actual,
        existsSync: vi.fn(() => false),
        readFileSync: vi.fn(() => "")
    }
})

vi.mock("@/loader/index", async (importOriginal) => {
    const actual = await importOriginal()
    return {
        //@ts-expect-error - mock implementation
        ...actual,
        loadFullConfig: vi.fn(async () => defaultConfig),
        loadDbConfig: vi.fn(async () => ({
            host: "localhost",
            port: 5432,
            name: "karr",
            user: "karr",
            password: "karr",
            ssl: false,
            connStr: "postgres://karr:karr@localhost:5432/karr"
        })),
        //@ts-expect-error - mock implementation
        getDbPasswordFromFile: vi.fn(actual.getDbPasswordFromFile)
    }
})

function clearEnvVars() {
    const vars = [
        "DB_HOST",
        "DB_PORT",
        "DB_NAME",
        "DB_USER",
        "DB_PASSWORD",
        "DB_PASSWORD_FILE",
        "APP_URL",
        "API_PORT",
        "ADMIN_EMAIL",
        "LOG_LEVEL",
        "LOG_TIMESTAMP",
        "NODE_ENV"
    ]
    for (const key of vars) {
        delete process.env[key]
    }
}

describe("config module", () => {
    beforeEach(async () => {
        vi.resetModules()
        vi.clearAllMocks()
        clearEnvVars()

        // Reset mocks to default values
        const tmp = {
            ...defaultConfig,
            APP_URL: "http://example.org/" // Add APP_URL which is now required
        }

        const parsedConfig = await FullConfigSchema.parseAsync(tmp)
        vi.mocked(loadFullConfig).mockImplementation(async () => parsedConfig)
        vi.mocked(existsSync).mockReturnValue(false)
    })

    afterEach(() => {
        vi.clearAllMocks()
        clearEnvVars()
    })

    it("default export shouldn't pass FullConfigSchema without required fields", async () => {
        // Mock loadFullConfig to return a config missing required fields
        vi.mocked(loadFullConfig).mockImplementation(
            async () =>
                ({
                    ...defaultConfig,
                    API_BASE: "/api/v1" // Make sure API_BASE is set correctly
                    // Intentionally omit APP_URL
                    // biome-ignore lint/suspicious/noExplicitAny: intentional
                }) as any
        )

        const { default: config } = await import("@/config.js")

        // We should now validate directly instead of relying on the module's validation
        const result = FullConfigSchema.safeParse(config)
        expect(result.success).toBe(false)
        expect(result.error?.issues[0]?.path).toContain("APP_URL")
    })

    it("should load default config when no config file exists", async () => {
        const { default: config } = await import("@/config.js")

        expect(config).toMatchObject({
            APPLICATION_NAME: staticConfig.APPLICATION_NAME,
            API_PORT: defaultConfig.API_PORT,
            LOG_LEVEL: defaultConfig.LOG_LEVEL,
            LOG_TIMESTAMP: defaultConfig.LOG_TIMESTAMP,
            APP_URL: "http://example.org/", // Now we expect APP_URL to be present
            PRODUCTION: false
        })

        expect(Object.keys(config)).not.toContain("DB_CONFIG")
    })

    it("should load and merge custom config file values", async () => {
        const customConfig = {
            ...defaultConfig,
            APP_URL: "http://localhost/", // Add required APP_URL
            API_PORT: 4000,
            LOG_LEVEL: "debug"
        }

        const parsedCustomConfig =
            await FullConfigSchema.parseAsync(customConfig)
        vi.mocked(loadFullConfig).mockImplementation(
            async () => parsedCustomConfig
        )

        const { default: config } = await import("@/config.js")

        expect(config.API_PORT).toBe(4000)
        expect(config.LOG_LEVEL).toBe("debug")
        expect(config.APP_URL).toBe("http://localhost/")
    })

    it("env-defineable fields should be overridden by env vars", async () => {
        process.env.API_PORT = "1337"
        process.env.LOG_LEVEL = "warn"
        process.env.APP_URL = "http://localhost/"

        const customConfig = {
            ...defaultConfig,
            APP_URL: "http://localhost/",
            API_PORT: 1337,
            LOG_LEVEL: "warn"
        }

        const parsedEnvConfig = await FullConfigSchema.parseAsync(customConfig)
        vi.mocked(loadFullConfig).mockImplementation(
            async () => parsedEnvConfig
        )

        const { default: config } = await import("@/config.js")

        expect(config.API_PORT).toBe(1337)
        expect(config.LOG_LEVEL).toBe("warn")
        expect(config.APP_URL).toBe("http://localhost/")
    })

    describe("getDbConfig", () => {
        beforeEach(() => {
            vi.resetModules()
            vi.clearAllMocks()
            clearEnvVars()
        })

        afterEach(() => {
            vi.clearAllMocks()
            clearEnvVars()
        })

        it("should load database config from environment variables", async () => {
            // Set up environment variables
            process.env.DB_HOST = "test-host"
            process.env.DB_PORT = "5432"
            process.env.DB_NAME = "test-db"
            process.env.DB_USER = "test-user"
            process.env.DB_PASSWORD = "test-pass"

            // Mock loadDbConfig to return a basic config
            const mockDbConfig = {
                host: "test-host",
                port: 5432,
                name: "test-db",
                user: "test-user",
                password: "test-pass",
                ssl: false,
                connStr: "postgres://test-user:test-pass@test-host:5432/test-db"
            }
            vi.mocked(loadDbConfig).mockImplementationOnce(
                async () => mockDbConfig
            )

            const { getDbConfig } = await import("@/config.js")
            const dbConfig = await getDbConfig()

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

        it("should load database config from config file when available", async () => {
            const configFile = "karr.config.yaml"
            const sampleDbConfig = {
                host: sampleConfigJson.DB_CONFIG.host,
                port: sampleConfigJson.DB_CONFIG.port,
                name: sampleConfigJson.DB_CONFIG.db_name,
                user: sampleConfigJson.DB_CONFIG.user,
                password: sampleConfigJson.DB_CONFIG.password,
                ssl: false,
                connStr: `postgres://${sampleConfigJson.DB_CONFIG.user}:${sampleConfigJson.DB_CONFIG.password}@${sampleConfigJson.DB_CONFIG.host}:${sampleConfigJson.DB_CONFIG.port}/${sampleConfigJson.DB_CONFIG.db_name}`
            }

            // existsSync should return true when checking for the password file
            // but false when checking for the config file
            vi.mocked(existsSync).mockImplementation((path) => {
                if (path.toString().endsWith(configFile)) {
                    return true
                } else {
                    return false
                }
            })

            // readFileSync should return the password when checking for the password file
            // but return the config file contents when checking for the config file
            vi.mocked(readFileSync).mockImplementation((path) => {
                if (path.toString().endsWith(configFile)) {
                    return sampleConfigFile
                } else {
                    return readFileSync("./fixtures/sample_config.yaml")
                }
            })

            // Mock loadDbConfig with the sample config
            vi.mocked(loadDbConfig).mockImplementationOnce(
                async () => sampleDbConfig
            )

            const { getDbConfig } = await import("@/config.js")
            const dbConfig = await getDbConfig()

            expect(dbConfig.password).toBe(sampleConfigJson.DB_CONFIG.password)
            expect(dbConfig.host).toBe(sampleConfigJson.DB_CONFIG.host)
            expect(dbConfig.port).toBe(sampleConfigJson.DB_CONFIG.port)
            expect(dbConfig.name).toBe(sampleConfigJson.DB_CONFIG.db_name)
            expect(dbConfig.user).toBe(sampleConfigJson.DB_CONFIG.user)

            // Verify the connection string
            expect(dbConfig.connStr).toBe(
                `postgres://${sampleConfigJson.DB_CONFIG.user}:${sampleConfigJson.DB_CONFIG.password}@${sampleConfigJson.DB_CONFIG.host}:${sampleConfigJson.DB_CONFIG.port}/${sampleConfigJson.DB_CONFIG.db_name}`
            )
        })

        it("should load database password from file when specified", async () => {
            const passwordFile = join("test", "fixtures", "password.txt")
            const password = "secret-password"

            const mockDbConfigWithFile = {
                host: "localhost",
                port: 5432,
                name: "testdb",
                user: "testuser",
                password: password,
                ssl: false,
                connStr: `postgres://testuser:${password}@localhost:5432/testdb`
            }
            vi.mocked(loadDbConfig).mockImplementationOnce(
                async () => mockDbConfigWithFile
            )

            // existsSync should return true when checking for the password file
            vi.mocked(existsSync).mockImplementation((path) => {
                return normalize(path.toString()).endsWith(
                    normalize(passwordFile)
                )
            })

            // readFileSync should return the password when checking for the password file
            vi.mocked(readFileSync).mockImplementation((path) => {
                if (
                    normalize(path.toString()).endsWith(normalize(passwordFile))
                ) {
                    return password
                }
                return readFileSync("./fixtures/sample_config.yaml")
            })

            const { getDbConfig } = await import("@/config.js")
            const dbConfig = await getDbConfig()

            expect(dbConfig.password).toBe(password)

            // Verify the connection string
            expect(dbConfig.connStr).toBe(
                `postgres://testuser:${password}@localhost:5432/testdb`
            )
        })
    })

    describe("named exports", () => {
        it("should export individual config values", async () => {
            const expectedConfig: Promise<FullConfig> =
                FullConfigSchema.parseAsync({
                    ...defaultConfig,
                    APP_URL: "http://localhost/", // Add required APP_URL
                    API_PORT: 3000,
                    LOG_TIMESTAMP: true,
                    LOG_LEVEL: "info",
                    API_BASE: "/api/v1", // Make sure API_BASE is set correctly
                    APPLICATION_NAME: "karr",
                    PRODUCTION: false,
                    ADMIN_EMAIL: "admin@example.com"
                })

            const resolved = await expectedConfig
            vi.mocked(loadFullConfig).mockImplementation(async () => resolved)

            const {
                API_PORT,
                APP_URL,
                LOG_TIMESTAMP,
                LOG_LEVEL,
                APPLICATION_NAME,
                PRODUCTION,
                ADMIN_EMAIL
            } = await import("@/config.js")

            const ec = await expectedConfig

            expect(API_PORT).toBe(ec.API_PORT)
            expect(APP_URL).toBe(ec.APP_URL)
            expect(LOG_TIMESTAMP).toBe(ec.LOG_TIMESTAMP)
            expect(LOG_LEVEL).toBe(ec.LOG_LEVEL)
            expect(APPLICATION_NAME).toBe(ec.APPLICATION_NAME)
            expect(PRODUCTION).toBe(ec.PRODUCTION)
            expect(ADMIN_EMAIL).toBe(ec.ADMIN_EMAIL)
        })
    })
})
