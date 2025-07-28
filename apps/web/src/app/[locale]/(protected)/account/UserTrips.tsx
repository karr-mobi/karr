"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CarFrontIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { TripCard } from "@/components/TripCard"
import { orpc } from "@/lib/orpc"

export function UserTrips() {
    const t = useTranslations("Account")

    const { data, isError, error } = useSuspenseQuery(
        orpc.user.trips.queryOptions()
    )

    if (isError || !data) {
        console.error("Error loading user data", error)
        return <p>Error loading user data</p>
    }

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <CarFrontIcon className="h-5 w-5" />
                    {t("my-trips")}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row flex-wrap gap-4">
                    {data.length === 0 ? (
                        <p>{t("no-trips-found")}</p>
                    ) : (
                        data.map((trip) => (
                            <TripCard
                                key={trip.id}
                                trip={trip}
                                variant="flat"
                                className="cursor-pointer transition-colors hover:bg-accent/50"
                            />
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
