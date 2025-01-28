import { z } from "zod"

import staticConfig from "./static.js"

// ====================================================================
// Config file
// ====================================================================

export const logLevels = ["trace", "debug", "info", "warn", "error"] as const
export const LogLevelSchema = z.enum(logLevels)

export const ConfigFileSchema = z
    .object({
        APPLICATION_NAME: z.string().optional(),
        API_PORT: z.number().positive().optional(),
        API_BASE: z.string().optional(),
        LOG_TIMESTAMP: z.boolean().optional(),
        LOG_LEVEL: LogLevelSchema.optional(),
        ADMIN_EMAIL: z.string().email().optional(),
        FEDERATION: z.boolean().optional(),
        FEDERATION_TARGETS: z
            .array(
                z.object({
                    name: z.string(),
                    url: z.string()
                }),
                {
                    message:
                        "Invalid federation target. Needs am array of objects with name and url"
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
            .strict()
            .refine(
                // Needs either password or passwordfile but not both
                (data) =>
                    (data.password || data.password_file) &&
                    !(data.password && data.password_file),
                {
                    message: "Either password or password_file must be defined, not both"
                }
            )
            .optional()
    })
    .strict()

export type ConfigFile = z.infer<typeof ConfigFileSchema>

// ====================================================================
// Full config spec
// ====================================================================

export const FullConfigSchema = z
    .object({
        API_PORT: z.number().positive(),
        API_BASE: z.string(),
        LOG_TIMESTAMP: z.boolean(),
        LOG_LEVEL: LogLevelSchema.default(
            !(process.env.NODE_ENV === "production" || process.env.DOCKER)
                ? "trace"
                : "info"
        ),
        ADMIN_EMAIL: z.string().email().optional(),
        FEDERATION: z.boolean(),
        // TODO: move this to settings to be editable via the UI
        FEDERATION_TARGETS: z.array(
            z.object({
                name: z.string(),
                url: z.union([z.string().url(), z.string().ip()])
            })
        ),
        API_VERSION: z.enum(["v1"]).default(staticConfig.API_VERSION),
        APPLICATION_NAME: z.string().default(staticConfig.APPLICATION_NAME),
        PRODUCTION: z.boolean().default(process.env.NODE_ENV === "production")
    })
    .strip()

export type FullConfig = z.infer<typeof FullConfigSchema>
