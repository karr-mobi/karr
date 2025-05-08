import { Hono } from "hono"

import type { AppVariables } from "@/lib/types.d.ts"

const hono = new Hono<{ Variables: AppVariables }>()

export default hono
