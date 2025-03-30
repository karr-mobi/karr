import { getClient, getCallbackUrl } from "@karr/auth/client"
import { lazy } from "@karr/config"

const c = lazy(async () => await getClient())
const u = lazy(async () => await getCallbackUrl())

export const client = await c.value
export const callbackUrl = await u.value
