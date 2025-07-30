"use client"

import { Badge } from "@karr/ui/components/badge"
import { Card, CardContent } from "@karr/ui/components/card"
import { Image } from "@karr/ui/components/image"
import { Skeleton } from "@karr/ui/components/skeleton"
import { useDisplayName, useInitials } from "@karr/ui/hooks/users"
import { isDefinedError } from "@orpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CalendarIcon, CarIcon, VerifiedIcon } from "lucide-react"
import { notFound } from "next/navigation"
import { useTranslations } from "next-intl"
import { orpc } from "@/lib/orpc"

export function ProfileInfoSkeleton() {
    return (
        <div className="mx-auto max-w-4xl">
            {/* Profile Header */}
            <div className="mb-8 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
                    <div className="relative w-full md:w-auto">
                        <Skeleton className="mx-auto h-[80vw] max-h-80 w-[80vw] max-w-80 rounded-xl sm:h-64 sm:w-64 md:h-48 md:w-48 lg:h-64 lg:w-64" />
                    </div>
                    <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
                        <div className="flex items-center justify-center gap-4">
                            <Skeleton className="h-9 w-48 md:h-10 md:w-64" />
                        </div>

                        <Skeleton className="h-5 w-64 md:w-80" />

                        {/* Basic Info Card */}
                        <Skeleton className="h-36 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ProfileInfo({ userId }: { userId: string }) {
    const t = useTranslations("Profile")

    const {
        data: profile,
        isError,
        error
    } = useSuspenseQuery(
        orpc.user.profile.queryOptions({
            input: userId,
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

    const displayName = useDisplayName(profile)
    const initials = useInitials(profile)

    if (isError || !profile) {
        if (isDefinedError(error) && error.code === "NOT_FOUND") {
            return (
                <div className="py-12 text-center">
                    <p className="text-muted-foreground">{t("not-found")}</p>
                </div>
            )
        }
        return (
            <div className="py-12 text-center">
                <p className="text-muted-foreground">{t("error-loading")}</p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl">
            {/* Profile Header */}
            <div className="mb-8 px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
                    <div className="relative w-full md:w-auto">
                        <div className="relative mx-auto h-[80vw] max-h-80 w-[80vw] max-w-80 overflow-hidden rounded-xl shadow-xl ring-4 ring-background sm:h-64 sm:w-64 md:h-48 md:w-48 lg:h-64 lg:w-64">
                            {profile.avatar ? (
                                <Image
                                    src={profile.avatar}
                                    alt={displayName}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted text-5xl md:text-4xl lg:text-5xl">
                                    {initials}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
                        <div className="flex items-center justify-center gap-4">
                            <h1 className="font-bold text-3xl md:text-4xl">
                                {displayName}
                            </h1>
                            {profile.specialStatus && (
                                <Badge
                                    variant="secondary"
                                    className="mb-1 self-end"
                                >
                                    <VerifiedIcon className="mr-1 h-3 w-3" />
                                    {profile.specialStatus}
                                </Badge>
                            )}
                        </div>

                        {profile.bio && <p>{profile.bio}</p>}

                        {/* Basic Info Card */}
                        <Card className="w-full ">
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <CarIcon className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-sm">
                                            {t("trips-published", {
                                                count: profile.tripsCount
                                            })}
                                        </p>
                                    </div>
                                </div>
                                {profile.createdAt && (
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium text-sm">
                                                {t("member-since", {
                                                    date: profile.createdAt
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
