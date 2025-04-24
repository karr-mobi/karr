import { createClient } from "@openauthjs/openauth/client"
import { logger } from "@karr/logger"

/**
 * The path to the OpenAuth issuer's authorization endpoint, where it is mounted in the Hono app
 */
export const issuerPath = "/auth"
/**
 * The path to the OpenAuth issuer's callback endpoint, where it is mounted in the OpenAuth app
 */
export const callbackPath = "/callback"
/**
 * The client ID for this specific application
 */
export const clientID = "karr"

/**
 * Constructs the full issuer path based on the app API base path and APP URL if provided.
 * @param apiBase - The base path of the API (e.g., /api/v1)
 * @param appUrl - The base URL of the app (e.g., http://localhost:3000)
 * @returns The full issuer URL
 */
export const authBaseUrl = (apiBase: string, appUrl?: string) => {
    const path = `${apiBase.replace(/\/$/, "")}${issuerPath}`
    if (!appUrl) return path

    const url = new URL(appUrl)
    url.pathname = path
    return url.toString()
}

/**
 * Constructs the full callback URL based on the runtime issuer URL.
 * @returns The full callback URL
 */
export async function getCallbackUrl() {
    const { APP_URL, API_BASE } = await import("@karr/config")

    const issuerUrl = authBaseUrl(API_BASE, APP_URL)

    if (!issuerUrl) {
        logger.error(
            "Issuer URL must be provided at runtime to getCallbackUrl."
        )
        return ""
    }
    const callbackUrl = `${issuerUrl.replace(/\/$/, "")}${callbackPath}`

    if (!callbackUrl) {
        logger.error("Failed to initialize callback URL.")
        process.exit(1)
    }

    return callbackUrl
}

/**
 * Creates an auth client instance configured with the runtime issuer URL.
 * @returns An initialized OpenAuth client and the callback URL
 */
export async function getClient() {
    const { APP_URL, API_BASE } = await import("@karr/config")

    const issuerUrl = authBaseUrl(API_BASE, APP_URL)

    if (!issuerUrl) {
        logger.error("Issuer URL must be provided at runtime to getClient.")
        process.exit(1)
    }

    const client = createClient({
        clientID,
        issuer: issuerUrl,
        fetch: (url, options) => {
            logger.debug("fetch", url, options)
            return fetch(url, options)
        }
    })

    if (!client) {
        logger.error("Failed to initialize OpenAuth client.")
        process.exit(1)
    }

    return client
}
