"use client"

import { Badge } from "@karr/ui/components/badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import { useDisplayName } from "@karr/ui/hooks/users"
import { useQuery } from "@tanstack/react-query"
import { CarIcon, UserIcon, VerifiedIcon } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { useTranslations } from "next-intl"
import Loading from "@/components/Loading"
import { client } from "@/util/apifetch"

const profileRoute =
    client.user.profile[
        ":id{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}"
    ]

export default function ProfileInfo({ userId }: { userId: string }) {
    const t = useTranslations("Profile")

    const {
        data: profile,
        isError,
        isLoading
    } = useQuery({
        queryKey: ["profile", userId],
        queryFn: async () => {
            const res = await profileRoute.$get({
                param: {
                    id: userId
                }
            })

            if (res.status === 404) {
                notFound()
            }

            if (res.status !== 200) {
                throw new Error("Failed to fetch profile data")
            }

            return res.json()
        }
    })

    const displayName = useDisplayName(profile || {})

    if (isLoading) {
        return <Loading />
    }

    if (isError || !profile) {
        return (
            <div className="py-12 text-center">
                <p className="text-muted-foreground">{t("error-loading")}</p>
            </div>
        )
    }

    const initials =
        `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase()

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
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <UserIcon className="h-5 w-5" />
                                    {t("basic-info")}
                                </CardTitle>
                            </CardHeader>
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
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
