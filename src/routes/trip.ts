import type { DataResponse } from "../lib/types.d.ts"
import logger from "../util/logger.ts"
import { Hono } from "hono"
import { streamSSE } from "hono/streaming"

const hono = new Hono()

/**
 * Search for a trip locally and on federated servers
 * @param from The starting location. Coordinates in the format "lat,lon"
 * @param to The destination location. Coordinates in the format "lat,lon"
 * @param date The date of the trip. Format "YYYY-MM-DD"
 * @returns The list of trips, including those from federated servers. The list is sent as an SSE stream.
 */
hono.get("/search", (c) => {
    return streamSSE(c, async (stream) => {
        const from = c.req.query("from")
        const to = c.req.query("to")
        const date = c.req.query("date")

        const tripsToSend: Promise<void>[] = []

        function sendData(data: object[]) {
            for (const item of data) {
                tripsToSend.push(stream.writeSSE({
                    data: JSON.stringify(item),
                    event: "new-trip",
                    id: crypto.randomUUID(),
                }))
            }
        }

        try {
            // Get the trips from the local server
            const immediatePromise: Promise<void> = getImmediateData().then(sendData)
            // Get the trips from the federated servers
            const slowerPromises: Promise<void>[] = [
                getSlowerData().then(sendData),
            ]

            await Promise.all([...tripsToSend, immediatePromise, ...slowerPromises])
            logger.debug("All data sent")
        } catch (error) {
            logger.error("Error sending SSE data:", error)
        }
    })
})

/**
 * Get a trip by ID
 * @param id The ID of the trip
 * @returns The trip
 */
hono.get("/:id", (c) => {
    const id: string = c.req.param("id")
    logger.debug(`Getting trip by ID: ${id}`)
    logger.warn('"/:id"', "Are you sure this is the route you wanted to hit?")
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
            resolve([{ immediateObject1: "data1", id: 1 }, {
                immediateObject2: "data2",
                id: 3,
            }])
        }, 50) // Simulate delay
    })
}

function getSlowerData(): Promise<object[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([{ slowerObject1: "data3", id: 2 }, {
                slowerObject2: "data4",
                id: 4,
            }])
        }, 1500) // Simulate delay
    })
}
