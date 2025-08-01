"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import type { TripsSearch } from "@/api/routes/trips"
import Loading from "@/components/Loading"
import { TripCard } from "@/components/TripCard"
import { TripSchema } from "@/db/schemas/trips"
import { orpc } from "@/lib/orpc"

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
                    if (trip.event === "new-trip") {
                        return parseTrip(trip)
                    }
                    if (trip.event === "no-trips") {
                        return <div key={trip.id}>No trips found</div>
                    }
                    if (trip.event === "failed") {
                        console.log("event failure", trip)
                        return (
                            <div key={trip.id}>Error: {String(trip.data)}</div>
                        )
                    }
                    if (trip.event === "end") {
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
                if (trip.event === "new-trip") {
                    return parseTrip(trip)
                }
                if (trip.event === "no-trips") {
                    return <div key={trip.id}>No trips found</div>
                }
                if (trip.event === "failed") {
                    console.log("event failure", trip)
                    return <div key={trip.id}>Error: {String(trip.data)}</div>
                }
                if (trip.event === "end") {
                    console.log("isEnd", trip)
                }
                return null
            })}
            {isFetching && <Loading />}
        </section>
    )
}
