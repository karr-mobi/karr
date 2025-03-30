import { getRuntimeClient } from "@karr/auth/client"
import { lazy, APP_URL, API_BASE } from "@karr/config"

const c = lazy(() => getRuntimeClient(APP_URL, API_BASE))

export const { client, callbackUrl } = c.value
