import { existsSync, readFileSync } from "node:fs"
import { join, normalize } from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import defaultConfig from "@/default_config.json" with { type: "json" }
import { loadDbConfig, loadFullConfig } from "@/loader.js"
import { ConfigFileSchema, FullConfigSchema } from "@/schema.js"
import staticConfig from "@/static.js"
import sampleConfigJson from "@/test/fixtures/sample_config.json" with {
    type: "json"
}

defaultConfig.API_BASE += "/" + staticConfig.API_VERSION

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
        //@ts-expect-error - mock implementation
        readFileSync: vi.fn(actual.readFileSync)
    }
})

vi.mock("@/loader.js", async (importOriginal) => {
    const actual = await importOriginal()
    return {
        //@ts-expect-error - mock implementation
        ...actual,
        loadFullConfig: vi.fn(() => defaultConfig),
        //@ts-expect-error - mock implementation
        loadDbConfig: vi.fn(actual.loadDbConfig),
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
    vars.forEach((key) => delete process.env[key])
}

describe("config module", () => {
    beforeEach(() => {
        vi.resetModules()
        vi.clearAllMocks()
        clearEnvVars()

        // Reset mocks to default values
        const tmp = {
            ...defaultConfig,
            APP_URL: "http://example.org/" // Add APP_URL which is now required
        }

        vi.mocked(loadFullConfig).mockReturnValue(FullConfigSchema.parse(tmp))
        vi.mocked(existsSync).mockReturnValue(false)
    })

    afterEach(() => {
        vi.clearAllMocks()
        clearEnvVars()
    })

    it("default export shouldn't pass FullConfigSchema without required fields", async () => {
        // Mock loadFullConfig to return a config missing required fields
        vi.mocked(loadFullConfig).mockReturnValue({
            ...defaultConfig,
            API_BASE: "/api/v1" // Make sure API_BASE is set correctly
            // Intentionally omit APP_URL
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)

        const { default: config } = await import("@/config.js")

        // We should now validate directly instead of relying on the module's validation
        const result = FullConfigSchema.safeParse(config)
        expect(result.success).toBe(false)
        expect(result.error!.issues[0]!.path).toContain("APP_URL")
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

        vi.mocked(loadFullConfig).mockReturnValue(
            FullConfigSchema.parse(customConfig)
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

        vi.mocked(loadFullConfig).mockReturnValue(
            FullConfigSchema.parse(customConfig)
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
            vi.mocked(loadDbConfig).mockReturnValueOnce(
                ConfigFileSchema.parse({
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

        it("should load database config from config file when available", async () => {
            const configFile = "karr.config.yaml"

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

            const { getDbConfig } = await import("@/config.js")
            const dbConfig = getDbConfig()

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

            vi.mocked(loadDbConfig).mockImplementation(() => {
                return ConfigFileSchema.parse({
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
            })

            // existsSync should return true when checking for the password file
            // but false when checking for the config file
            vi.mocked(existsSync).mockImplementation((path) => {
                return normalize(path.toString()).endsWith(
                    normalize(passwordFile)
                )
            })

            // readFileSync should return the password when checking for the password file
            // but return the config file contents when checking for the config file
            vi.mocked(readFileSync).mockImplementation((path) => {
                if (
                    normalize(path.toString()).endsWith(normalize(passwordFile))
                ) {
                    return password
                }
                return readFileSync("./fixtures/sample_config.yaml")
            })

            const { getDbConfig } = await import("@/config.js")
            const dbConfig = getDbConfig()

            expect(dbConfig.password).toBe(password)
            expect(existsSync).toHaveBeenCalledWith(
                join(process.cwd(), passwordFile)
            )

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
                APP_URL: "http://localhost/", // Add required APP_URL
                API_PORT: 3000,
                LOG_TIMESTAMP: true,
                LOG_LEVEL: "info",
                API_BASE: "/api/v1", // Make sure API_BASE is set correctly
                APPLICATION_NAME: "karr",
                PRODUCTION: false,
                ADMIN_EMAIL: "admin@example.com"
            })

            vi.mocked(loadFullConfig).mockReturnValue(expectedConfig)

            const {
                API_PORT,
                APP_URL,
                LOG_TIMESTAMP,
                LOG_LEVEL,
                APPLICATION_NAME,
                PRODUCTION,
                ADMIN_EMAIL
            } = await import("@/config.js")

            expect(API_PORT).toBe(expectedConfig.API_PORT)
            expect(APP_URL).toBe(expectedConfig.APP_URL)
            expect(LOG_TIMESTAMP).toBe(expectedConfig.LOG_TIMESTAMP)
            expect(LOG_LEVEL).toBe(expectedConfig.LOG_LEVEL)
            expect(APPLICATION_NAME).toBe(expectedConfig.APPLICATION_NAME)
            expect(PRODUCTION).toBe(expectedConfig.PRODUCTION)
            expect(ADMIN_EMAIL).toBe(expectedConfig.ADMIN_EMAIL)
        })
    })
})
