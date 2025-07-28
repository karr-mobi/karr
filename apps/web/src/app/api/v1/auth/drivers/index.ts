import { logger } from "@karr/logger"
import { isBun, isDeno, isNode } from "std-env"

/**
 * Load the appropriate database driver based on the runtime environment
 * Each environment's driver is imported dynamically to ensure code splitting
 * and avoid loading incompatible dependencies in different runtimes
 *
 * The dynamic imports use esbuild's code splitting to create separate chunks,
 * preventing Deno from evaluating Bun-specific code and vice versa.
 *
 * @returns A Promise that resolves to the storage driver or undefined if no driver could be loaded
 */
export async function getDriver() {
    if (isBun) {
        const { getBunDriver } = await import("./bun-driver")
        return await getBunDriver()
    }
    if (isNode || isDeno) {
        const { getNodeDriver } = await import("./node-driver")
        return await getNodeDriver()
    }
    // Default driver for unknown environments
    logger.debug("Using default in-memory driver")
    logger.warn("No persistent storage for auth - data will be lost on restart")
    return undefined
}
