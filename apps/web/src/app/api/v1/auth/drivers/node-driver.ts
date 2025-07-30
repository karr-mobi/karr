import { logger } from "@karr/logger"
import { createDatabase } from "db0"
import { isDeno, runtime } from "std-env"

export async function getNodeDriver() {
    try {
        // Dynamic import to allow runtime-specific loading
        const { default: sqlite } = await import("db0/connectors/node-sqlite")
        const { default: dbDriver } = await import("unstorage/drivers/db0")

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

        const driver = dbDriver({
            database,
            tableName: "openauth"
        })

        return driver
    } catch (error) {
        logger.error(
            `[${runtime}] getNodeDriver: Error initializing driver:`,
            error
        )
        throw error
    }
}
