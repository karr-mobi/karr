import { logger } from "@karr/logger"
import type { StorageAdapter } from "@openauthjs/openauth/storage/storage"
import { createDatabase } from "db0"
import sqlite from "db0/connectors/bun-sqlite"
import { err, ok, type Result } from "neverthrow"
import { runtime } from "std-env"
import dbDriver from "unstorage/drivers/db0"
import { UnStorage } from "@/adapters/unstorage-adapter"
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

// biome-ignore lint/suspicious/useAwait: needs to be async
export async function getOpenAuthStorage(): Promise<
    Result<StorageAdapter, unknown>
> {
    const store = getStore()

    if (store.isErr()) {
        logger.error(
            `[${runtime}] getOpenAuthStorage: Error initializing store:`,
            store.error
        )
        return err(store.error)
    }

    const driver = UnStorage({
        store: store.value
    })

    return ok(driver)
}
