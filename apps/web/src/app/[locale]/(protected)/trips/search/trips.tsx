"use client"

import { type Trip, TripSchema } from "@karr/api/db/trips"
import { Badge } from "@karr/ui/components/badge"
import { Button } from "@karr/ui/components/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import { toast } from "@karr/ui/components/sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Earth as IconEarth, House as IconHouse, TrashIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { apiFetch, client } from "@/util/apifetch"

export default function FetchTrips() {
    const queryClient = useQueryClient()
    const [trips, setTrips] = useState<Trip[]>([])
    const [loading, setLoading] = useState(false)
    const t = useTranslations("trips.Delete")

    async function deleteTrip(tripId: string): Promise<undefined> {
        const res = await client.trips[
            ":id{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}"
        ].$delete({
            param: {
                id: tripId
            }
        })

        if (res.status === 200) {
            toast.success(t("success"))
            queryClient.invalidateQueries({ queryKey: ["trips"] })
            setTrips([])
        } else if (res.status === 404) {
            toast.error(t("not-found"))
        } else if (res.status === 401) {
            toast.error(t("unauthorized"))
        } else {
            toast.error(t("other-error"))
        }
    }

    const {
        data: stream,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["trips"],
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        queryFn: async () =>
            apiFetch("/trips/search", {
                responseType: "stream"
            })
    })

    useEffect(() => {
        if (!stream) return

        const reader = stream.getReader()
        const decoder = new TextDecoder()
        let buffer = ""
        let mounted = true // Add mounted flag

        //biome-ignore lint/complexity/noExcessiveCognitiveComplexity: this is a complex function
        async function processStream() {
            try {
                setLoading(true)
                while (mounted) {
                    // Check if still mounted
                    //biome-ignore lint/nursery/noAwaitInLoop: need to await here
                    const { done, value } = await reader.read()
                    if (done) {
                        setLoading(false)
                        break
                    }

                    buffer += decoder.decode(value, { stream: true })

                    // Split by newlines and process complete JSON objects
                    const lines = buffer.split("\n")
                    buffer = lines.pop() || "" // Keep the last incomplete line in buffer

                    const newTrips = lines
                        .filter((line) => line.startsWith("data: "))
                        .map((l) => {
                            let line = l.trim()
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

                    if (newTrips.length > 0 && mounted) {
                        // Check if still mounted
                        setTrips((prev) => [...prev, ...newTrips])
                    }
                }

                // Process any remaining data
                if (buffer.trim() && mounted) {
                    try {
                        const tripData = JSON.parse(buffer)
                        const trip = TripSchema.parse(tripData)
                        setTrips((prev) => [...prev, trip])
                    } catch (e) {
                        console.error("Failed to parse final trip:", e)
                    }
                }
            } catch (e) {
                if (mounted) {
                    // Only log if still mounted
                    console.error("Stream reading error:", e)
                }
            }
        }

        void processStream()

        return () => {
            mounted = false // Set mounted to false on cleanup
            // Ensure we properly clean up the reader
            try {
                reader.cancel()
            } catch (e) {
                console.error("Error cleaning up reader:", e)
            } finally {
                reader.releaseLock()
                // Clear local trips state
                setTrips([])
            }
        }
    }, [stream])

    useEffect(() => {
        // Clear trips when component mounts or userid changes
        setTrips([])
    }, [])

    if (isLoading) {
        return <Loading />
    }

    if (isError || !stream) {
        return <div>Error: {error?.message}</div>
    }

    return (
        <section className="flex flex-col items-center justify-start gap-4">
            {trips.map((trip: Trip) => {
                const t = TripSchema.parse(trip)
                return (
                    <TripCard
                        key={`${trip.origin || ""}@${t.id}`}
                        trip={t}
                        onDelete={deleteTrip}
                    />
                )
            })}
            {loading && <Loading />}
        </section>
    )
}

function TripCard({
    trip,
    onDelete
}: {
    trip: Trip
    onDelete: (id: string) => Promise<void>
}) {
    return (
        <Card className="w-lg max-w-full">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row items-center justify-between gap-2">
                        <p>
                            {trip.from} – {trip.to}
                        </p>
                        {!trip.origin && (
                            <Button
                                variant="outline"
                                onClick={() => onDelete(trip.id)}
                            >
                                <TrashIcon />
                            </Button>
                        )}
                    </div>
                </CardTitle>
                <CardDescription>
                    {new Date(trip.departure).toLocaleDateString(useLocale(), {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>{trip.price} €</p>
            </CardContent>
            <CardFooter className="flow-inline">
                {trip.origin ? (
                    <Badge
                        variant="outline"
                        className="flex flex-row items-center gap-1 text-sm"
                    >
                        <IconEarth />
                        {trip.origin}
                    </Badge>
                ) : (
                    <Badge
                        variant="outline"
                        className="flex flex-row items-center gap-1 text-sm"
                    >
                        <IconHouse className="my-0.5" />
                    </Badge>
                )}
                <p>
                    {trip.nickname ||
                        `${trip.firstName} ${trip.lastName || ""}` ||
                        trip.driver.split("-")[0]}
                </p>
            </CardFooter>
        </Card>
    )
}
