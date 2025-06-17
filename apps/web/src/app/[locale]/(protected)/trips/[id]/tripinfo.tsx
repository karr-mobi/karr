//biome-ignore-all lint/nursery/noProcessGlobal: Webpack can't handle node: imports
//biome-ignore-all lint/style/noProcessEnv: Just for dev

"use client"

import type { InferResponseType } from "@karr/api/client"
import { Avatar, AvatarFallback, AvatarImage } from "@karr/ui/components/avatar"
import { Badge } from "@karr/ui/components/badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import { Label } from "@karr/ui/components/label"
import { Separator } from "@karr/ui/components/separator"
import { useQuery } from "@tanstack/react-query"
import {
    CalendarIcon,
    CheckIcon,
    CigaretteIcon,
    ClockIcon,
    Music4Icon,
    OctagonXIcon,
    PawPrintIcon,
    RouteIcon,
    UserIcon,
    UsersIcon,
    ZapIcon
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Loading from "@/components/Loading"
import { client } from "@/util/apifetch"

const tripRoute =
    client.trips[
        ":id{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}"
    ]

type Trip = InferResponseType<typeof tripRoute.$get, 200>["data"]

export default function FetchTripData({ tripId }: { tripId: string }) {
    const { data, isError, isLoading, error } = useQuery({
        queryKey: ["trip", tripId],
        queryFn: async () => {
            const res = await tripRoute.$get({
                param: {
                    id: tripId
                }
            })
            if (res.status !== 200) {
                throw new Error("Failed to fetch trip data")
            }
            return res.json()
        }
    })

    if (isLoading) {
        return <Loading />
    }

    if (isError || !data) {
        console.error("Error loading trip data", error)
        return <p>Error loading trip data</p>
    }

    return <ShowTripData trip={data.data} />
}

function ShowTripData({ trip }: { trip: Trip }) {
    const t = useTranslations("Trips")
    const locale = useLocale()

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(locale, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    return (
        <div className="grid gap-6">
            {/* Trip Overview Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <RouteIcon className="h-5 w-5" />
                        {t("trip-overview")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="!font-normal !font-sans text-lg">
                                {`${trip.from} → ${trip.to}`}
                            </h3>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-2xl">
                                {trip.price} €
                            </div>
                            <div className="text-muted-foreground text-sm">
                                {t("per-seat")}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-sm">
                                    {formatDate(trip.departure)}
                                </div>
                            </div>
                            <ClockIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-sm">
                                    {formatTime(trip.departure)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-sm">
                                    {trip.places}
                                    <span className="ml-1 font-medium">
                                        {t("seats")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {trip.preferences?.autoBook && (
                            <div className="flex items-center gap-3">
                                <ZapIcon className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="font-medium text-sm">
                                        {t("auto-book")}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* trip.description && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <div className="font-medium text-sm">{t("description")}</div>
                                <p className="text-muted-foreground text-sm">{trip.description}</p>
                            </div>
                        </>
                    ) */}
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Driver Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <UserIcon className="h-5 w-5" />
                            {t("driver-info")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage
                                    src={trip.driver.avatar || undefined}
                                />
                                <AvatarFallback>
                                    {`${trip.driver.firstName?.[0] || ""}${trip.driver.lastName?.[0] || ""}`.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h4 className="font-medium">
                                    {trip.driver.nickname ||
                                        `${trip.driver.firstName} ${trip.driver.lastName}`.trim()}
                                </h4>
                                <div className="flex items-center gap-2">
                                    {trip.driver.verified ? (
                                        <Badge
                                            variant="default"
                                            className="text-xs"
                                        >
                                            <CheckIcon className="mr-1 h-3 w-3" />
                                            {t("verified")}
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="destructive"
                                            className="text-xs"
                                        >
                                            <OctagonXIcon className="mr-1 h-3 w-3" />
                                            {t("not-verified")}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Trip Preferences Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("trip-preferences")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Music4Icon className="h-4 w-4 text-muted-foreground" />
                                <Label className="font-medium text-sm">
                                    {t("music-allowed")}
                                </Label>
                            </div>
                            <Badge
                                variant={
                                    trip.preferences?.music
                                        ? "default"
                                        : "secondary"
                                }
                            >
                                {trip.preferences?.music ? t("yes") : t("no")}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CigaretteIcon className="h-4 w-4 text-muted-foreground" />
                                <Label className="font-medium text-sm">
                                    {t("smoking-allowed")}
                                </Label>
                            </div>
                            <Badge
                                variant={
                                    trip.preferences?.smoke
                                        ? "destructive"
                                        : "default"
                                }
                            >
                                {trip.preferences?.smoke ? t("yes") : t("no")}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <PawPrintIcon className="h-4 w-4 text-muted-foreground" />
                                <Label className="font-medium text-sm">
                                    {t("pets-allowed")}
                                </Label>
                            </div>
                            <Badge
                                variant={
                                    trip.preferences?.pets
                                        ? "default"
                                        : "secondary"
                                }
                            >
                                {trip.preferences?.pets ? t("yes") : t("no")}
                            </Badge>
                        </div>

                        <Separator />
                    </CardContent>
                </Card>
            </div>

            {process.env.NODE_ENV !== "production" && (
                <details className="mt-4 ml-4 text-sm">
                    <summary className="text-muted-foreground text-xs">
                        {t("raw-trip-data")}
                    </summary>
                    <pre>{JSON.stringify(trip, null, 2)}</pre>
                </details>
            )}
        </div>
    )
}
