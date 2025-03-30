import { createClient } from "@openauthjs/openauth/client"

import { APP_URL, API_BASE } from "@karr/config"

export const authBaseUrl = (() => {
    const url = new URL(APP_URL)
    url.pathname = `${API_BASE}/auth`
    return url.toString()
})()

export const client = createClient({
    clientID: "nextjs",
    issuer: authBaseUrl
})

export const callbackUrl = `${authBaseUrl}/callback`
