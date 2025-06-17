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
import { Earth as IconEarth, House as IconHouse, TrashIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/auth/context"
import Loading from "@/components/Loading"
import { Link } from "@/i18n/routing"
import { client } from "@/util/apifetch"

export default function FetchTrips({ url }: { url: string }) {
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
        } else if (res.status === 404) {
            toast.error(t("not-found"))
        } else if (res.status === 401) {
            toast.error(t("unauthorized"))
        } else {
            toast.error(t("other-error"))
        }
    }

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
                console.log("parsed trip data", tripData)
                const trip = TripSchema.parse(tripData)
                console.log("parsed trip", trip)
                setTrips((prev) => [...prev, trip])
                console.log("updated trip")
            } catch (e) {
                console.error("Failed to parse trip:", e)
            }
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
                            onDelete={deleteTrip}
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
    const authState = useAuth().authState

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
                        {!trip.origin && authState?.id === trip.driver && (
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
