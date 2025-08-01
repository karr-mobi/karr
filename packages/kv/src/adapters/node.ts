import { logger } from "@karr/logger"
import { createDatabase } from "db0"
import sqlite from "db0/connectors/node-sqlite"
import { err, ok } from "neverthrow"
import { isDeno, runtime } from "std-env"
import dbDriver from "unstorage/drivers/db0"
import { createStore } from "@/storage"
import type { Store } from "@/types"

function getNodeDriver() {
    try {
        const database = createDatabase(
            sqlite({
                name: "karr"
            })
        )

        logger.debug(
            isDeno
                ? "Using node-sqlite driver in Deno"
                : "Using node sqlite driver"
        )

        const driver = dbDriver({
            database,
            tableName: "karr"
        })

        return ok(driver)
    } catch (error) {
        logger.error(
            `[${runtime}] getNodeDriver: Error initializing driver:`,
            error
        )
        return err(error)
    }
}

/**
 * Get the store instance.
 * Uses the node-sqlite driver for use in Node.js and Deno (runtime, not Deploy).
 */
export function getStore(): Store {
    const driver = getNodeDriver()

    if (driver.isErr()) {
        logger.error(
            `[${runtime}] getStore: Error initializing driver:`,
            driver.error
        )
        return err(driver.error)
    }

    return ok(
        createStore({
            driver: driver.value
        })
    )
}
