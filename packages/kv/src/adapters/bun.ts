import { logger } from "@karr/logger"
import { createDatabase } from "db0"
import sqlite from "db0/connectors/bun-sqlite"
import { err, ok } from "neverthrow"
import { runtime } from "std-env"
import dbDriver from "unstorage/drivers/db0"
import { createStore } from "@/storage"
import type { Store } from "@/types"

/**
 * Get a database driver for Bun runtime
 * This function dynamically imports Bun-specific modules
 * to ensure they're in a separate chunk and won't be evaluated
 * in other runtimes like Deno
 */
export function getBunDriver() {
    try {
        const database = createDatabase(
            sqlite({
                name: "karr"
            })
        )
        logger.debug("Using bun sqlite driver")
        return ok(
            dbDriver({
                database,
                tableName: "karr"
            })
        )
    } catch (error) {
        logger.error(
            `[${runtime}] getBunDriver: Error initializing driver:`,
            error
        )
        return err(error)
    }
}

/**
 * Get the store instance.
 * Uses the Bun sqlite driver for use in Bun.
 */
export function getStore(): Store {
    const driver = getBunDriver()

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
