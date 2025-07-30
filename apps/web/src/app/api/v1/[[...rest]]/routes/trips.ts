import type { InferRouterOutputs } from "@orpc/server"
import { z } from "zod/v4-mini"
import { NewTripInputSchema } from "@/api/db/schemas/trips"
import {
    addTrip,
    deleteTrip,
    getTrip,
    getTripDetails,
    getTrips
} from "@/api/lib/db/trips"
import { base } from "../server"

const searchTrips = base
    .route({
        method: "GET"
    })
    .handler(async function* () {
        // TODO: add filters

        const trips = await getTrips()

        if (trips.isErr()) {
            yield {
                data: trips.error,
                event: "failed" as const,
                id: crypto.randomUUID()
            }
            return
        }

        for (const trip of trips.value) {
            yield {
                data: trip,
                event: "new-trip" as const,
                id: trip.id
            }
        }

        yield {
            data: {
                failed: true,
                message: "No trips found"
            },
            event: "failed" as const,
            id: crypto.randomUUID()
        }

        yield {
            data: null,
            event: "end" as const,
            id: crypto.randomUUID()
        }

        // TODO: add federation
    })
    .callable()

export type TripsSearch = InferRouterOutputs<
    typeof searchTrips
    //biome-ignore lint/suspicious/noExplicitAny: intentional
> extends AsyncGenerator<infer Y, any, any>
    ? Y
    : never

const addNewTrip = base
    .route({
        method: "POST"
    })
    .input(NewTripInputSchema)
    .handler(async ({ context, input: trip, errors }) => {
        console.debug(`Adding trip: ${context.user.id}`, trip)

        const createdTrip = await addTrip({
            ...trip,
            driver: context.user.id
        })

        if (createdTrip.isErr()) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to create trip",
                cause: createdTrip.error
            })
        }

        return {
            id: createdTrip.value.id,
            name: "Test Trip"
        }
    })
    .callable()

const getTripProc = base
    .route({
        method: "GET"
    })
    .input(z.uuid())
    .handler(async ({ input, errors }) => {
        const trip = await getTripDetails(input)

        if (trip.isErr()) {
            throw trip.error === "Trip not found"
                ? errors.NOT_FOUND({
                      message: trip.error
                  })
                : errors.INTERNAL_SERVER_ERROR({
                      message: "Failed to get trip",
                      cause: trip.error
                  })
        }

        return trip.value
    })
    .callable()

export type Trip = InferRouterOutputs<typeof getTripProc>

const deleteTripProc = base
    .route({
        method: "DELETE"
    })
    .input(z.uuidv4())
    .handler(async ({ input: tripId, errors, context }) => {
        const trip = await getTrip(tripId)

        if (trip.isErr()) {
            throw trip.error === "Trip not found"
                ? errors.NOT_FOUND({
                      message: trip.error
                  })
                : errors.INTERNAL_SERVER_ERROR({
                      message: "Failed to get trip",
                      cause: trip.error
                  })
        }

        if (trip.value.driver !== context.user.id) {
            throw errors.FORBIDDEN({
                message: "Trip does not belong to you"
            })
        }

        console.debug(`Deleting trip: ${context.user.id} ${tripId}`)
        const res = await deleteTrip(tripId, context.user.id)

        if (!res) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to delete trip"
            })
        }

        return {
            success: true
        }
    })
    .callable()

export const router = {
    search: searchTrips,
    add: addNewTrip,
    get: getTripProc,
    delete: deleteTripProc
}

export default router
