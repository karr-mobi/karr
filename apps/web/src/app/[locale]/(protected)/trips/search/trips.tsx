"use client"

import { type Trip, TripSchema } from "@karr/api/db/trips"
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { TripCard } from "@/components/TripCard"

export default function FetchTrips({ url }: { url: string }) {
    const [trips, setTrips] = useState<Trip[]>([])
    const [loading, setLoading] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const eventSource = new EventSource(url)
        setIsLoading(true)
        setLoading(true)
        setError(null)

        eventSource.addEventListener("new-trip", (event) => {
            try {
                console.log("event data", event.data)
                const tripData = JSON.parse(event.data)
                const trip = TripSchema.parse(tripData)
                setTrips((prev) => [...prev, trip])
            } catch (e) {
                console.error("Failed to parse trip:", e)
            }
        })

        eventSource.addEventListener("failed", (event) => {
            console.error("Error:", event.data)
        })

        eventSource.onopen = (e) => {
            console.log("EventSource opened", e)
            setIsLoading(false)
            setLoading(false)
        }

        eventSource.onerror = () => {
            console.log("EventSource stream ended")
            // TODO: add error handling logic. Not yet implemented because normal stream closure is considered as an error. Need to look into it more.
            setIsLoading(false)
            setLoading(false)
            eventSource.close()
        }

        return () => {
            eventSource.close()
            setTrips([])
        }
    }, [url])

    useEffect(() => {
        // Clear trips when component mounts or userid changes
        setTrips([])
    }, [])

    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return (
            <>
                <div>Error: {error?.message}</div>
                {trips.map((trip) => {
                    const t = TripSchema.parse(trip)
                    return (
                        <TripCard
                            key={`${t.id}@${trip.origin || ""}`}
                            trip={t}
                            className="md:w-lg"
                        />
                    )
                })}
                {loading && <Loading />}
            </>
        )
    }

    return (
        <section className="flex flex-col items-center justify-start gap-4">
            {trips.map((trip: Trip) => {
                const t = TripSchema.parse(trip)
                return (
                    <TripCard
                        key={`${t.id}@${trip.origin || ""}`}
                        trip={t}
                        className="md:w-lg"
                    />
                )
            })}
            {loading && <Loading />}
        </section>
    )
}
