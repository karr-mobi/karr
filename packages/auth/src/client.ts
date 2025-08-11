// biome-ignore-all lint/suspicious/noConsole: it's fine

import { API_BASE, APP_URL } from "@karr/config"
import { createClient } from "@openauthjs/openauth/client"
import { ISSUER } from "./issuer-config"

/**
 * The client ID for this specific application
 */
export const CLIENT_ID = "karr"
/**
 * The path to the OpenAuth issuer's callback endpoint, where it is mounted in the OpenAuth app
 */
export const CALLBACK_URL = new URL(`${API_BASE}/callback`, APP_URL).href

export const client = createClient({
    clientID: CLIENT_ID,
    issuer: ISSUER,
    fetch: (url, options) => {
        console.debug("fetch", url, options)
        return fetch(url, options)
    }
})
