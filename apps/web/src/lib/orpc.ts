import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import type { router } from "~/api/v1/[[...rest]]/route"

declare global {
    var $client: RouterClient<typeof router> | undefined
}

const link = new RPCLink({
    url: () => {
        if (typeof window === "undefined") {
            throw new Error("RPCLink is not allowed on the server side.")
        }

        return `${window.location.origin}/api/v1`
    }
})

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: RouterClient<typeof router> =
    globalThis.$client ?? createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)
