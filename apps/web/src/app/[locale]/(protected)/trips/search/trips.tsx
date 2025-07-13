"use client"

import { type Trip, TripSchema } from "@karr/api/db/trips"
import { Avatar, AvatarFallback, AvatarImage } from "@karr/ui/components/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import { useLocale } from "next-intl"
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { Link } from "@/i18n/routing"

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
                            key={`${trip.origin || ""}@${t.id}`}
                            trip={t}
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
                    <TripCard key={`${trip.origin || ""}@${t.id}`} trip={t} />
                )
            })}
            {loading && <Loading />}
        </section>
    )
}

function TripCard({ trip }: { trip: Trip }) {
    return (
        <Card className="w-lg max-w-full">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row items-center justify-between gap-2">
                        <p>
                            <Link href={`/trips/${trip.id}`}>
                                {trip.from} – {trip.to}
                            </Link>
                        </p>
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
                <Avatar>
                    <AvatarImage src={trip.avatar || ""} />
                    <AvatarFallback>
                        {trip.nickname?.slice(0, 2).toUpperCase() ||
                            `${trip.firstName?.charAt(0).toUpperCase()}${trip.lastName?.charAt(0).toUpperCase() || ""}` ||
                            trip.driver.split("-")[0]}
                    </AvatarFallback>
                </Avatar>

                <p>
                    {trip.nickname ||
                        `${trip.firstName} ${trip.lastName || ""}` ||
                        trip.driver.split("-")[0]}
                </p>
            </CardFooter>
        </Card>
    )
}
