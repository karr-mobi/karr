"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { TripSchema } from "@/api/db/schemas/trips"
import type { TripsSearch } from "@/api/routes/trips"
import Loading from "@/components/Loading"
import { TripCard } from "@/components/TripCard"
import { orpc } from "@/lib/orpc"

function eventType(trip: TripsSearch) {
    return {
        isTrip: trip.event === "new-trip",
        isFailure: trip.event === "failed",
        isEnd: trip.event === "end"
    }
}

function parseTrip(trip: TripsSearch) {
    const t = TripSchema.safeParse(trip.data)
    if (!t.success) {
        console.error("Failed to parse trip", t.error)
        return null
    }
    return (
        <TripCard
            key={`${t.data.id}@${""}`}
            trip={t.data}
            className="md:w-lg"
        />
    )
}

export default function FetchTrips() {
    const {
        data: trips,
        isFetching,
        isError,
        error
    } = useSuspenseQuery(orpc.trips.search.experimental_streamedOptions())

    if (isError) {
        return (
            <>
                <div>Error: {error.message}</div>
                {trips?.map((trip) => {
                    const { isTrip, isFailure, isEnd } = eventType(trip)
                    if (isTrip) {
                        return parseTrip(trip)
                    }
                    if (isFailure) {
                        console.log("event failure", trip)
                        return (
                            <div key={trip.id}>Error: {String(trip.data)}</div>
                        )
                    }
                    if (isEnd) {
                        console.log("isEnd", trip)
                    }
                    return null
                })}
                {isFetching && <Loading />}
            </>
        )
    }

    return (
        <section className="flex flex-col items-center justify-start gap-4">
            {trips?.map((trip) => {
                const { isTrip, isFailure, isEnd } = eventType(trip)
                if (isTrip) {
                    return parseTrip(trip)
                }
                if (isFailure) {
                    console.log("event failure", trip)
                    return <div key={trip.id}>Error: {String(trip.data)}</div>
                }
                if (isEnd) {
                    console.log("isEnd", trip)
                }
                return null
            })}
            {isFetching && <Loading />}
        </section>
    )
}
