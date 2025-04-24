import path from "node:path"
import { fileURLToPath } from "node:url"
import { MigrationConfig } from "drizzle-orm/migrator"
import { migrate } from "drizzle-orm/postgres-js/migrator"

import db from "@karr/db"
import logger from "@karr/logger"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Run database migrations
 */
export async function drizzleMigrate(): Promise<void> {
    const migrationsFolder =
        process.env.DOCKER === "1"
            ? path.join(__dirname, "./migrations")
            : path.join(__dirname, "../migrations")

    try {
        await migrate(db, {
            migrationsFolder
        } as MigrationConfig)
        logger.success("Database migrations completed successfully")
    } catch (error) {
        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            error.code === "42P07"
        ) {
            // Tables already exist, this is fine
            logger.info("Tables already exist, skipping migrations")
            return
        }
        logger.error("Error running migrations:", error)
        throw error
    }
}
