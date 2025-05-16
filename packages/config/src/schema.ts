//biome-ignore-all lint/style/useNamingConvention: config values are CONSTANT_CASE

import process from "node:process"
import { isCI, isProduction } from "std-env"
import { z } from "zod/v4"
import staticConfig from "./static.js"

// ====================================================================
// Config file
// ====================================================================

export const logLevels = ["trace", "debug", "info", "warn", "error"] as const
export const LogLevelSchema = z.enum([...logLevels])

/**
 * Required keys for the config file or env
 */
export const requiredKeys = ["APP_URL", "AUTH_PROVIDERS"]

const appUrlSchema = z
    .url({
        error: "App URL must only be a domain and protocol",
        abort: true
    })
    .refine((url) => !(!isCI && url.includes("build.time")), {
        error: "Please specify an APP_URL"
    })
    .refine((url) => new URL(url).pathname === "/")

export const apiBaseSchema = z
    .string()
    .refine((val) => val.startsWith("/") && !val.endsWith("/"), {
        error: "API base must only be an absolute pathname, without a trailing slash"
    })

export const authProvidersSchema = z.array(
    z.discriminatedUnion([
        z
            .object({
                name: z.union([z.literal("password"), z.literal("code")]),
                trusted: z.boolean().default(false).optional()
            })
            .refine(() => !isProduction || isCI, {
                error: "Password and Code Providers are not available for production"
            }),
        // Google OIDC provider
        z.object({
            name: z.literal("google"),
            clientID: z.string(),
            query: z.record(z.string(), z.string()).optional(),
            trusted: z.boolean().default(false).optional()
        }),
        // Other built-in OAuth2 providers
        z.object({
            name: z.union([
                z.literal("github")
                // TODO: z.literal("yahoo"),
                // TODO: z.literal("twitch"),
                // TODO: z.literal("facebook"),
                // TODO: z.literal("jumpcloud")
            ]),
            clientID: z.string(),
            clientSecret: z.string(),
            query: z.record(z.string(), z.string()).optional(),
            trusted: z.boolean().default(false).optional()
        })
    ])
)

export type AuthProvider = z.infer<typeof authProvidersSchema>[number]

// TODO: Generic OIDC provider
/* z.object({
        name: z.literal("oidc"),
        clientID: z.string(),
        issuer: z.string(),
        query: z.record(z.string(), z.string()).optional(),
        scopes: z.array(z.string()).optional()
    }), */
// TODO: Generic OAuth2 provider
/* z.object({
        name: z.literal("oauth2"),
        clientID: z.string(),
        clientSecret: z.string(),
        endpoint: z.object({
            authorization: z.string(),
            jwks: z.string().optional(),
            token: z.string()
        }),
        pkce: z.boolean().optional(),
        query: z.record(z.string(), z.string()).optional(),
        scopes: z.array(z.string())
    }), */
// TODO: Apple OAuth2 provider
/* z.object({
        name: z.literal("apple"),
        clientID: z.string(),
        clientSecret: z.string(),
        pkce: z.boolean().optional(),
        query: z.record(z.string(), z.string()).optional(),
        response_mode: z.union([
            z.literal("query"),
            z.literal("form_post")
        ]),
        scopes: z.array(z.string())
    }), */
// TODO: Slack OAuth2 provider
/* z.object({
        name: z.literal("slack"),
        clientID: z.string(),
        clientSecret: z.string(),
        pkce: z.boolean().optional(),
        query: z.record(z.string(), z.string()).optional(),
        scopes: z.array(
            z.union([
                z.literal("email"),
                z.literal("profile"),
                z.literal("openid")
            ])
        ),
        team: z.string()
    }), */
// TODO: Cognito OAuth2 provider
/* z.object({
        name: z.literal("cognito"),
        clientID: z.string(),
        clientSecret: z.string(),
        domain: z.string(),
        pkce: z.boolean().optional(),
        query: z.record(z.string(), z.string()).optional(),
        region: z.string(),
        scopes: z.array(z.string())
    }), */
// TODO: Keycloak OAuth2 provider
/* z.object({
        name: z.literal("keycloak"),
        baseUrl: z.string(),
        clientID: z.string(),
        clientSecret: z.string(),
        pkce: z.boolean().optional(),
        query: z.record(z.string(), z.string()).optional(),
        realm: z.string(),
        scopes: z.array(z.string())
    }), */
// TODO: Microsoft OAuth2 provider
/* z.object({
        name: z.literal("microsoft"),
        clientID: z.string(),
        clientSecret: z.string(),
        pkce: z.boolean().optional(),
        query: z.record(z.string(), z.string()).optional(),
        scopes: z.array(z.string()),
        tenant: z.string()
    }), */

export const ConfigFileSchema = z.object({
    APPLICATION_NAME: z.string().optional(),
    APP_URL: appUrlSchema.optional(),
    API_PORT: z.number().positive().optional(),
    API_BASE: apiBaseSchema.optional(),
    LOG_TIMESTAMP: z.boolean().optional(),
    LOG_LEVEL: LogLevelSchema.optional(),
    ADMIN_EMAIL: z.email().optional(),
    FEDERATION: z.boolean().optional(),
    AUTH_PROVIDERS: authProvidersSchema.optional(),
    FEDERATION_TARGETS: z
        .array(
            z.object({
                name: z.string(),
                url: z.string()
            }),
            {
                error: "Invalid federation target. Needs am array of objects with name and url"
            }
        )
        .optional(),
    DB_CONFIG: z
        .object({
            host: z.string().optional(),
            port: z.number().optional(),
            user: z.string().optional(),
            password: z.string().optional(),
            password_file: z.string().optional(),
            db_name: z.string().optional(),
            ssl: z.boolean().optional()
        })
        .refine(
            // Needs either password or passwordfile but not both
            (data) =>
                (data.password || data.password_file) &&
                !(data.password && data.password_file),
            {
                error: "Either password or password_file must be defined, not both"
            }
        )
        .optional()
})

export type ConfigFile = z.infer<typeof ConfigFileSchema>

// ====================================================================
// Full config spec
// ====================================================================

export const FullConfigSchema = z.object({
    APP_URL: appUrlSchema,
    API_PORT: z.number().positive(),
    API_BASE: apiBaseSchema.refine(
        (val) => val.endsWith(`/${staticConfig.API_VERSION}`),
        {
            error: "Computed API base must end with the API version"
        }
    ),
    LOG_TIMESTAMP: z.boolean(),
    LOG_LEVEL: LogLevelSchema.default(
        process.env.NODE_ENV === "production" || process.env.DOCKER
            ? "info"
            : "trace"
    ),
    ADMIN_EMAIL: z.email().optional(),
    FEDERATION: z.boolean(),
    AUTH_PROVIDERS: authProvidersSchema.min(1).max(18),
    // TODO: move federation targets to settings to be editable via the UI
    FEDERATION_TARGETS: z.array(
        z.object({
            name: z.string(),
            url: z.union([z.url(), z.ipv4(), z.ipv6()])
        })
    ),
    APPLICATION_NAME: z.string().default(staticConfig.APPLICATION_NAME),
    PRODUCTION: z.boolean().default(isProduction)
})

export type FullConfig = z.infer<typeof FullConfigSchema>

export const DbConfigSchema = z.object({
    host: z.string(),
    port: z.number(),
    name: z.string(),
    user: z.string(),
    password: z.string().optional(),
    ssl: z.boolean(),
    connStr: z.string()
})

export type DbConfig = z.infer<typeof DbConfigSchema>
