import "server-only"
import { getRuntimeClient } from "@karr/auth/client"
//eslint-disable-next-line no-restricted-imports
import { lazy } from "@karr/config"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || ""
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ""

const c = lazy(() => getRuntimeClient(APP_URL, API_BASE))

export const { client, callbackUrl } = c.value
