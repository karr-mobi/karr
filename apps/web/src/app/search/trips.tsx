"use client"

import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { TripSchema, type Trip } from "@karr/db/schemas/trips.js"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"

import { QueryProvider } from "@/components/QueryProvider"
import { apiFetch } from "@/util/apifetch"

export default function TripList({ userid }: { userid: string }) {
    return (
        <QueryProvider>
            <FetchTrips userid={userid} />
        </QueryProvider>
    )
}

function FetchTrips({ userid }: { userid: string }) {
    // Access the client
    const _queryClient = useQueryClient()
    const [trips, setTrips] = useState<Trip[]>([])

    const {
        data: stream,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["user", userid],
        retry: false,
        queryFn: async () =>
            apiFetch("/trips/search", {
                headers: {
                    authorization: userid
                },
                responseType: "stream"
            })
    })

    useEffect(() => {
        if (!stream) return

        const reader = stream.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        async function processStream() {
            try {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    buffer += decoder.decode(value, { stream: true })

                    // Split by newlines and process complete JSON objects
                    const lines = buffer.split("\n")
                    buffer = lines.pop() || "" // Keep the last incomplete line in buffer

                    const newTrips = lines
                        .filter((line) => line.startsWith("data: "))
                        .map((line) => {
                            line = line.trim()
                            try {
                                line = line.substring(6)
                                const tripData = JSON.parse(line)
                                return TripSchema.parse(tripData)
                            } catch (e) {
                                console.error("Failed to parse trip:", e)
                                return null
                            }
                        })
                        .filter((trip): trip is Trip => trip !== null)

                    if (newTrips.length > 0) {
                        setTrips((prev) => [...prev, ...newTrips])
                    }
                }

                // Process any remaining data
                if (buffer.trim()) {
                    try {
                        const tripData = JSON.parse(buffer)
                        const trip = TripSchema.parse(tripData)
                        setTrips((prev) => [...prev, trip])
                    } catch (e) {
                        console.error("Failed to parse final trip:", e)
                    }
                }
            } catch (e) {
                console.error("Stream reading error:", e)
            }
        }

        processStream()

        return () => {
            reader.cancel()
        }
    }, [stream])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError || !stream) {
        return <div>Error: {error?.message}</div>
    }

    return (
        <section className="mt-10 flex flex-col items-center justify-start gap-4">
            {trips.map((trip: Trip) => {
                const t = TripSchema.parse(trip)
                return <TripCard key={t.id} trip={t} />
            })}
        </section>
    )
}

function TripCard({ trip }: { trip: Trip }) {
    return (
        <Card className="min-w-lg">
            <CardHeader>
                <CardTitle>
                    {trip.from} to {trip.to}
                </CardTitle>
                <CardDescription>
                    {new Date(trip.departure).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>{trip.price} €</p>
            </CardContent>
            <CardFooter>
                <p>{trip.account}</p>
            </CardFooter>
        </Card>
    )
}
