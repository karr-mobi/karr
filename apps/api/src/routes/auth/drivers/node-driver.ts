import { createDatabase } from "db0"
import { logger } from "@karr/logger"
import { isDeno, runtime } from "std-env"

export async function getNodeDriver() {
    logger.debug(
        `[${runtime}] getNodeDriver: Starting to initialize SQLite driver`
    )

    try {
        // Dynamic import to allow runtime-specific loading
        logger.debug(`[${runtime}] getNodeDriver: Importing sqlite connector`)
        const { default: sqlite } = await import("db0/connectors/node-sqlite")

        logger.debug(`[${runtime}] getNodeDriver: Importing db0 driver`)
        const { default: dbDriver } = await import("unstorage/drivers/db0")

        logger.debug(`[${runtime}] getNodeDriver: Creating database`)
        const database = createDatabase(
            sqlite({
                name: "openauth"
            })
        )

        logger.debug(
            isDeno
                ? "Using node-sqlite driver in Deno"
                : "Using node sqlite driver"
        )

        logger.debug(`[${runtime}] getNodeDriver: Creating db driver`)
        const driver = dbDriver({
            database,
            tableName: "openauth"
        })

        logger.debug(`[${runtime}] getNodeDriver: Driver created successfully`)
        return driver
    } catch (error) {
        logger.error(
            `[${runtime}] getNodeDriver: Error initializing driver:`,
            error
        )
        throw error
    }
}
