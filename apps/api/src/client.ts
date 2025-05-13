import { hc } from "hono/client"

export type { InferResponseType } from "hono/client"

import type { protectedRoutes } from "./server"

const _client = hc<typeof protectedRoutes>("")
export type Client = typeof _client

export const hcWithType = (...args: Parameters<typeof hc>): Client => {
    return hc<typeof protectedRoutes>(...args)
}
