import { logger } from "@karr/logger"

/**
 * Get a database driver for Bun runtime
 * This function dynamically imports Bun-specific modules
 * to ensure they're in a separate chunk and won't be evaluated
 * in other runtimes like Deno
 */
export async function getBunDriver() {
    // Dynamic imports to ensure code splitting
    const { createDatabase } = await import("db0")
    const { default: sqlite } = await import("db0/connectors/bun-sqlite")
    const { default: dbDriver } = await import("unstorage/drivers/db0")

    const database = createDatabase(
        sqlite({
            name: "openauth"
        })
    )
    logger.debug("Using bun sqlite driver")
    return dbDriver({
        database,
        tableName: "openauth"
    })
}
