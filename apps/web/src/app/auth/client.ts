import "server-only"

import { getCallbackUrl, getClient } from "@karr/auth/client"
import { lazy } from "@karr/util"

const c = lazy(async () => await getClient())
const u = lazy(async () => await getCallbackUrl())

export const client = await c.value
export const callbackUrl = await u.value
