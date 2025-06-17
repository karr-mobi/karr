import logger from "@karr/logger"
import { Hono } from "hono"
import { streamSSE } from "hono/streaming"
import { validator } from "hono/validator"
import { z } from "zod/v4-mini"
import { NewTripInputSchema, type Trip } from "@/db/schemas/trips"
import {
    addTrip,
    deleteTrip,
    getTrip,
    getTripDetails,
    getTrips
} from "@/lib/db/trips"
import type {
    AppVariables,
    DataResponse,
    ErrorResponse
} from "@/lib/types.d.ts"
import { getUserSub } from "@/util/subject"

const hono = new Hono<{ Variables: AppVariables }>()

    /**
     * Search for a trip locally and on federated servers
     * @param from The starting location. Coordinates in the format "lat,lon"
     * @param to The destination location. Coordinates in the format "lat,lon"
     * @param date The date of the trip. Format "YYYY-MM-DD"
     * @returns The list of trips, including those from federated servers. The list is sent as an SSE stream.
     */
    .get("/search", (c) => {
        return streamSSE(c, async (stream) => {
            const _from = c.req.query("from")
            const _to = c.req.query("to")
            const _date = c.req.query("date")

            const tripsToSend: Promise<void>[] = []

            function sendData(data: Trip[]) {
                logger.debug(`Sending ${data.length} trips`)
                for (const item of data) {
                    tripsToSend.push(
                        stream.writeSSE({
                            data: JSON.stringify(item),
                            event: "new-trip",
                            id: item.id
                        })
                    )
                }
            }

            try {
                // Get the trips from the local server
                const immediatePromise = getTrips().then((data) => {
                    if (data.isErr()) {
                        stream.writeSSE({
                            data: JSON.stringify(data.error),
                            event: "error",
                            id: crypto.randomUUID()
                        })
                        return Promise.reject(data.error)
                    }

                    sendData(data.value)
                })

                // Get the trips from the federated servers
                const slowerPromises: Promise<void>[] = []

                await Promise.allSettled([
                    ...tripsToSend,
                    immediatePromise,
                    ...slowerPromises
                ])
                logger.debug("All data sent")
            } catch (error) {
                stream.close()
                logger.error("Error sending SSE data:", error)
            }
        })
    })

    /**
     * Add a trip
     * @param id The ID of the account that is adding the trip
     * @returns The trip id and name
     */
    .post(
        "/add",
        validator("json", (value, c) => {
            const res = z.safeParse(NewTripInputSchema, value)
            if (!res.success) {
                return c.json(
                    {
                        message: "Invalid request body",
                        cause: res.error
                    } satisfies ErrorResponse,
                    400
                )
            }
            return res.data
        }),
        async (c) => {
            const subject = getUserSub(c)

            if (!subject) {
                return c.json(
                    {
                        message: "User subject missing in context"
                    } satisfies ErrorResponse,
                    500
                )
            }

            const t = c.req.valid("json")

            logger.debug(`Adding trip: ${subject.id}`, t)

            const createdTrip = await addTrip({
                ...t,
                driver: subject.id
            })

            if (createdTrip.isErr()) {
                return c.json(
                    {
                        message: "Error adding trip",
                        cause: createdTrip.error
                    } satisfies ErrorResponse,
                    500
                )
            }

            return c.json({
                data: {
                    id: createdTrip.value.id,
                    name: "Test Trip"
                }
            } satisfies DataResponse<object>)
        }
    )

    /**
     * Get a trip by ID
     * @param id The ID of the trip
     * @returns The trip
     */
    .get(
        "/:id{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}",
        async (c) => {
            const subject = getUserSub(c)

            if (!subject) {
                return c.json(
                    {
                        success: false,
                        message: "User subject missing in context"
                    },
                    500
                )
            }

            const tripId: string = c.req.param("id")

            const trip = await getTripDetails(tripId)

            if (trip.isErr()) {
                return c.json(
                    {
                        success: false,
                        error: trip.error
                    },
                    trip.error === "Trip not found" ? 404 : 500
                )
            }

            return c.json(
                {
                    success: true,
                    data: trip.value
                },
                200
            )
        }
    )

    /**
     * Delete a trip by ID
     * @param id The ID of the trip
     * @returns The trip
     */
    .delete(
        "/:id{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}",
        async (c) => {
            const subject = getUserSub(c)

            if (!subject) {
                return c.json(
                    {
                        success: false,
                        message: "User subject missing in context"
                    },
                    500
                )
            }

            const tripId: string = c.req.param("id")

            const trip = await getTrip(tripId)

            if (trip.isErr()) {
                return c.json(
                    {
                        success: false,
                        error: trip.error
                    },
                    trip.error === "Trip not found" ? 404 : 500
                )
            }

            if (trip.value.driver !== subject.id) {
                return c.json(
                    {
                        success: false,
                        error: "Trip does not belong to you"
                    },
                    401
                )
            }

            logger.debug(`Deleting trip: ${subject.id} ${tripId}`)
            const res = await deleteTrip(tripId, subject.id)

            if (!res) {
                return c.json(
                    {
                        success: false
                    },
                    401
                )
            }

            return c.json(
                {
                    success: true
                },
                200
            )
        }
    )

export default hono
