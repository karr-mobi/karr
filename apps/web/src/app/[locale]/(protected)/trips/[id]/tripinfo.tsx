//biome-ignore-all lint/nursery/noProcessGlobal: Webpack can't handle node: imports
//biome-ignore-all lint/style/noProcessEnv: Just for dev

"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@karr/ui/components/avatar"
import { Badge } from "@karr/ui/components/badge"
import { Button } from "@karr/ui/components/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@karr/ui/components/dialog"
import { Label } from "@karr/ui/components/label"
import { Separator } from "@karr/ui/components/separator"
import { toast } from "@karr/ui/components/sonner"
import { isDefinedError } from "@orpc/client"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import {
    CalendarIcon,
    CheckIcon,
    ChevronRightIcon,
    CigaretteIcon,
    ClockIcon,
    Music4Icon,
    OctagonXIcon,
    PawPrintIcon,
    RouteIcon,
    TrashIcon,
    UserIcon,
    UsersIcon,
    ZapIcon
} from "lucide-react"
import { notFound } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import type { Trip } from "@/api/routes/trips"
import { Link, redirect } from "@/i18n/routing"
import { useAuth } from "@/lib/auth/context"
import { orpc } from "@/lib/orpc"

export default function FetchTripData({ tripId }: { tripId: string }) {
    const { data, isError, error } = useSuspenseQuery(
        orpc.trips.get.queryOptions({
            input: tripId,
            throwOnError: false,
            retry: (failureCount, error) => {
                console.log(error)
                if (isDefinedError(error) && error.code === "NOT_FOUND") {
                    return false
                }
                return failureCount < 3
            },
            //biome-ignore lint/suspicious/noExplicitAny: intentional
            onError: (error: any) => {
                if (error?.code === "NOT_FOUND") {
                    notFound()
                }
            }
        })
    )

    if (isError || !data) {
        console.error("Error loading trip data", error)
        return <p>Error loading trip data</p>
    }

    return <ShowTripData trip={data} />
}

function ShowTripData({ trip }: { trip: Trip }) {
    const t = useTranslations("Trips")
    const tDelete = useTranslations("trips.Delete")
    const locale = useLocale()
    const user = useAuth()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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

    const deleteTripMutation = useMutation(
        orpc.trips.delete.mutationOptions({
            onSuccess: () => {
                toast.success(tDelete("success"))
                console.log("Trip deleted successfully")
                redirect({ href: "/trips/search", locale })
            },
            onError: (error) => {
                if (isDefinedError(error)) {
                    if (error.code === "NOT_FOUND") {
                        toast.error(tDelete("not-found"))
                    } else if (error.code === "UNAUTHORIZED") {
                        toast.error(tDelete("unauthorized"))
                    } else {
                        toast.error(tDelete("other-error"))
                    }
                }
            }
        })
    )

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
                <Link href={`/profile/${trip.driver.id}`} className="block">
                    <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <UserIcon className="h-5 w-5" />
                                    {t("driver-info")}
                                </div>
                                <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
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
                </Link>

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
                                        ? "default"
                                        : "secondary"
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

            {user?.authState?.provider === trip.driver.accountProvider &&
                user.authState?.remoteId === trip.driver.accountRemoteId && (
                    <Button
                        variant="destructive"
                        className="w-fit justify-self-end"
                        onClick={() => setDeleteDialogOpen(true)}
                    >
                        <TrashIcon />
                        {t("delete")}
                    </Button>
                )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("are-you-sure")}</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                void deleteTripMutation.mutate(trip.id)
                                setDeleteDialogOpen(false)
                            }}
                        >
                            {t("delete")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
