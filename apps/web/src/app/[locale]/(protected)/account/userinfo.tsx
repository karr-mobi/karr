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
import { Switch } from "@karr/ui/components/switch"
import { useInitials } from "@karr/ui/hooks/users"
import { useQuery } from "@tanstack/react-query"
import {
    CarIcon,
    CheckIcon,
    CigaretteIcon,
    MailIcon,
    Music4Icon,
    OctagonXIcon,
    PawPrintIcon,
    PhoneIcon,
    UserIcon
} from "lucide-react"
import { useTranslations } from "next-intl"
import Loading from "@/components/Loading"
import { client } from "@/util/apifetch"
import AvatarUpload from "./AvatarUpload"
import BioEdit from "./BioEdit"
import DisplayName from "./DisplayName"

export default function FetchUserData() {
    const { data, isError, isLoading, error } = useQuery({
        queryKey: ["user", "data"],
        queryFn: async () => {
            const res = await client.user.info.$get()
            if (res.status !== 200) {
                throw new Error("Failed to fetch user data", {
                    cause: await res.json()
                })
            }
            return res.json()
        }
    })

    if (isLoading) {
        return <Loading />
    }

    if (isError || !data) {
        console.error("Error loading user data", error)
        return <p>Error loading user data</p>
    }

    return <ShowUserData user={data} />
}

function ShowUserData({
    user
}: {
    user: InferResponseType<typeof client.user.info.$get, 200>
}) {
    const t = useTranslations("Account")

    const initials = useInitials(user)

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <UserIcon className="h-5 w-5" />
                        {t("profile-info")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user.avatar || undefined} />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <AvatarUpload currentAvatar={user.avatar} />
                        </div>
                        <div className="space-y-1">
                            <DisplayName
                                firstName={user.firstName}
                                lastName={user.lastName}
                                nickname={user.nickname}
                            />
                            <div className="flex items-center gap-2">
                                {user.verified ? (
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
                                <Badge variant="outline" className="text-xs">
                                    {user.provider}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <MailIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.email}</span>
                        </div>

                        {user.phone && (
                            <div className="flex items-center gap-3">
                                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{user.phone}</span>
                            </div>
                        )}

                        <BioEdit bio={user.bio} />
                    </div>
                </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("preferences.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CarIcon className="h-4 w-4 text-muted-foreground" />
                            <Label
                                htmlFor="auto-book"
                                className="font-medium text-sm"
                            >
                                {t("preferences.auto-book")}
                            </Label>
                        </div>
                        <Switch
                            id="auto-book"
                            checked={!!user.autoBook}
                            disabled
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Music4Icon className="h-4 w-4 text-muted-foreground" />
                            <Label
                                htmlFor="music"
                                className="font-medium text-sm"
                            >
                                {t("preferences.music")}
                            </Label>
                        </div>
                        <Switch id="music" checked={!!user.music} disabled />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CigaretteIcon className="h-4 w-4 text-muted-foreground" />
                            <Label
                                htmlFor="smoke"
                                className="font-medium text-sm"
                            >
                                {t("preferences.smoking")}
                            </Label>
                        </div>
                        <Switch id="smoke" checked={!!user.smoke} disabled />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <PawPrintIcon className="h-4 w-4 text-muted-foreground" />
                            <Label
                                htmlFor="pets"
                                className="font-medium text-sm"
                            >
                                {t("preferences.pets")}
                            </Label>
                        </div>
                        <Switch id="pets" checked={!!user.pets} disabled />
                    </div>

                    <div className="border-t pt-2">
                        <div className="flex items-center justify-between">
                            <Label className="font-medium text-sm">
                                {t("preferences.default-places")}
                            </Label>
                            <Badge variant="outline">
                                {user.defaultPlaces}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {process.env.NODE_ENV !== "production" && (
                <details className="mt-4 ml-4 text-sm">
                    <summary className="text-muted-foreground text-xs">
                        Raw user data
                    </summary>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </details>
            )}
        </div>
    )
}
