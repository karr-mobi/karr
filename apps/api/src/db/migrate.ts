import { migrate } from "drizzle-orm/postgres-js/migrator"

import logger from "@karr/util/logger"

import db from "~/lib/db_conn"

/**
 * Run database migrations
 */
export async function drizzleMigrate(): Promise<void> {
    logger.debug("Running database migrations...")

    try {
        await migrate(db, {
            migrationsFolder: "./drizzle"
        })
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
