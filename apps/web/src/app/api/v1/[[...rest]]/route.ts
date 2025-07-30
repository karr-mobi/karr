import { RPCHandler } from "@orpc/server/fetch"

import adminRouter from "./routes/admin"
import tripsRouter from "./routes/trips"
import userRouter from "./routes/user"

export const router = {
    admin: adminRouter,
    user: userRouter,
    trips: tripsRouter
}

const handler = new RPCHandler(router)

async function handleRequest(request: Request) {
    const { response } = await handler.handle(request, {
        prefix: "/api/v1"
    })

    return response ?? new Response("Not found", { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
