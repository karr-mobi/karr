import { Hono } from "hono"
import { handle } from "hono/vercel"
import issuer from "../issuer"

export const runtime = "nodejs"

const app = new Hono().basePath("/api/v1/auth")

app.route("/", issuer)

export const GET = handle(app)
export const HEAD = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
