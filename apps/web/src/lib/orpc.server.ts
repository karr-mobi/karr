import "server-only"

import { createRouterClient } from "@orpc/server"
import { router } from "~/api/v1/[[...rest]]/route"

globalThis.$client = createRouterClient(router, {})
