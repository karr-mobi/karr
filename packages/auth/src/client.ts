import { createClient, type ClientInput } from "@openauthjs/openauth/client"
import { logger } from "@karr/util/logger"

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
 * Constructs the full issuer URL based on the app URL and API base path.
 * @param appUrl - The base URL of the app (e.g., http://localhost:3000)
 * @param apiBase - The base path of the API (e.g., /api/v1)
 * @returns The full issuer URL
 */
export const authBaseUrl = (appUrl: string, apiBase: string) => {
    const url = new URL(appUrl)
    url.pathname = `${apiBase.replace(/\/$/, "")}${issuerPath}`
    return url.toString()
}

/**
 * Constructs the full callback URL based on the runtime issuer URL.
 * @param issuerUrl - The full base URL of the OpenAuth issuer (e.g., http://localhost:8080/api/v1/auth)
 * @returns The full callback URL
 */
function getRuntimeCallbackUrl(issuerUrl: string) {
    if (!issuerUrl) {
        logger.error("Issuer URL must be provided at runtime to getCallbackUrl.")
        return ""
    }
    // Ensure issuerUrl doesn't have a trailing slash before appending
    const cleanIssuerUrl = issuerUrl.replace(/\/$/, "")
    return `${cleanIssuerUrl}${callbackPath}`
}

/**
 * Creates an auth client instance configured with the runtime issuer URL.
 * @param appUrl - The base URL of the app (e.g., http://localhost)
 * @param apiBase - The base path of the API (e.g., /api/v1)
 * @param options - Optional additional client options
 * @returns An initialized OpenAuth client and the callback URL
 */
export function getRuntimeClient(
    appUrl: string,
    apiBase: string,
    options?: Omit<ClientInput, "issuer" | "clientID">
) {
    const issuerUrl = authBaseUrl(appUrl, apiBase)

    if (!issuerUrl) {
        logger.error("Issuer URL must be provided at runtime to getClient.")
        process.exit(1)
    }

    const client = createClient({
        clientID,
        issuer: issuerUrl,
        ...options
    })
    const callbackUrl = getRuntimeCallbackUrl(issuerUrl)

    if (!client) {
        logger.error("Failed to initialize OpenAuth client.")
        process.exit(1)
    }

    if (!callbackUrl) {
        logger.error("Failed to initialize callback URL.")
        process.exit(1)
    }

    return { client, callbackUrl }
}
