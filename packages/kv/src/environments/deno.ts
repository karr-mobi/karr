import { logger } from "@karr/logger"
import type { StorageAdapter } from "@openauthjs/openauth/storage/storage"
import { err, ok, type Result } from "neverthrow"
import { runtime } from "std-env"
import denoKVdriver from "unstorage/drivers/deno-kv"
import { DenoKV } from "@/adapters/deno-kv-adapter"
import { createStore } from "@/storage"
import type { Store } from "@/types"

/**
 * Get a unstorage driver for Deno runtime
 */
export function getDenoKvDriver() {
    try {
        logger.debug("Using Deno KV driver")
        return ok(denoKVdriver({}))
    } catch (error) {
        logger.error(
            `[${runtime}] getDenoKvDriver: Error initializing driver:`,
            error
        )
        return err(error)
    }
}

/**
 * Get the store instance.
 * Uses the Deno KV driver for use in Deno.
 */
export function getStore(): Store {
    const driver = getDenoKvDriver()

    if (driver.isErr()) {
        logger.error(
            `[${runtime}] getStore: Error initializing driver:`,
            driver.error
        )
        return driver
    }

    const storage = createStore({
        driver: driver.value
    })

    storage.watch((event, key) => {
        logger.debug(
            `[${runtime}] getStore: Watch event: ${event} for key: ${key}`
        )
    })

    return ok(storage)
}

export async function getOpenAuthStorage(): Promise<
    Result<StorageAdapter, unknown>
> {
    const driver = await DenoKV()

    return ok(driver)
}
