"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@karr/ui/components/avatar"
import { Badge } from "@karr/ui/components/badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import { useDisplayName } from "@karr/ui/hooks/users"
import { useQuery } from "@tanstack/react-query"
import {
    CarIcon,
    MessageSquareIcon,
    UserIcon,
    VerifiedIcon
} from "lucide-react"
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
            <div className="mb-8 text-center">
                <div className="mb-4 flex items-center justify-start gap-6">
                    <Avatar className="h-32 w-32">
                        <AvatarImage src={profile.avatar || undefined} />
                        <AvatarFallback className="text-2xl">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="item-start flex flex-col justify-start">
                        <h1 className="mb-2 font-bold text-3xl">
                            {displayName}
                        </h1>

                        {profile.specialStatus && (
                            <Badge
                                variant="secondary"
                                className="mb-4 self-start"
                            >
                                <VerifiedIcon className="mr-1 h-3 w-3" />
                                {profile.specialStatus}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="grid gap-6">
                {/* Basic Info Card */}
                <Card>
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

                {/* Bio Card */}
                {profile.bio && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <MessageSquareIcon className="h-5 w-5" />
                                {t("about")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-base">
                                {profile.bio}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
