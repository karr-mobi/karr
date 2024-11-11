import type { DataResponse } from "../lib/types.d.ts"
import logger from "../util/logger.ts"
import { Hono } from "hono"

const hono = new Hono()

hono.get("/:id", (c) => {
    const id: string = c.req.param("id")
    logger.debug(`Getting trip by ID: ${id}`)
    return c.json(
        <DataResponse<object>> {
            data: {
                id: id,
                name: "Test Trip",
            },
        },
    )
})

export default hono

// ===============================================
// ================ For SSE tests ================
// ===============================================

function getImmediateData(): Promise<object[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([{ immediateObject1: "data1" }, { immediateObject2: "data2" }])
        }, 50) // Simulate delay
    })
}

function getSlowerData(): Promise<object[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([{ slowerObject1: "data3" }, { slowerObject2: "data4" }])
        }, 1500) // Simulate delay
    })
}
