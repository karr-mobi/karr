import path from "node:path"
import { fileURLToPath } from "node:url"
import logger from "@karr/logger"
import type { MigrationConfig } from "drizzle-orm/migrator"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import db from "@/api/db"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Run database migrations
 */
export async function drizzleMigrate(): Promise<void> {
    const migrationsFolder = path.join(__dirname, "./migrations")

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
