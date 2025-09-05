//biome-ignore-all lint/nursery/noProcessGlobal: Webpack can't handle node: imports
//biome-ignore-all lint/style/noProcessEnv: Just for dev

"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@karr/ui/components/avatar"
import { Badge } from "@karr/ui/components/badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import { InputNumber } from "@karr/ui/components/input"
import { Label } from "@karr/ui/components/label"
import { Switch } from "@karr/ui/components/switch"
import { useDisplayName, useInitials } from "@karr/ui/hooks/users"
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery
} from "@tanstack/react-query"
import {
    CarIcon,
    CheckIcon,
    CigaretteIcon,
    MailIcon,
    MessageSquareIcon,
    Music4Icon,
    OctagonXIcon,
    PawPrintIcon,
    PhoneIcon,
    UserIcon
} from "lucide-react"
import { useTranslations } from "next-intl"
import { orpc } from "@/lib/orpc"
import { Edit } from "./EditProfile"

export default function FetchUserData() {
    const t = useTranslations("Account")

    const queryClient = useQueryClient()

    const {
        data: user,
        isError,
        error
    } = useSuspenseQuery(orpc.user.info.queryOptions())

    //TODO: implement default places limit
    const prefsMutation = useMutation(
        orpc.user.updateUserPrefs.mutationOptions({
            onMutate: async (newPrefs) => {
                await queryClient.cancelQueries({
                    queryKey: orpc.user.info.queryKey()
                })

                const previousData = queryClient.getQueryData(
                    orpc.user.info.queryKey()
                )

                queryClient.setQueryData(orpc.user.info.queryKey(), (old) => {
                    if (!old) return old
                    return {
                        ...old,
                        ...newPrefs
                    }
                })

                return { previousData }
            },
            onError: (err, _newPrefs, context) => {
                console.error(err)
                queryClient.setQueryData(
                    orpc.user.info.queryKey(),
                    context?.previousData
                )
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: orpc.user.info.queryKey()
                })
            }
        })
    )

    const initials = useInitials(user)
    const displayName = useDisplayName(user)

    if (isError || !user) {
        console.error("Error loading user data", error)
        return <p>Error loading user data</p>
    }

    return (
        <>
            <div className="mb-8">
                <h1 className="font-bold text-3xl">
                    {user?.firstName
                        ? t("title-named", { name: user.firstName })
                        : t("title")}
                </h1>
                <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <UserIcon className="h-5 w-5" />
                                {t("profile-info")}
                            </div>
                            <Edit user={user} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage
                                        src={user.avatar || undefined}
                                    />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="space-y-1">
                                <h3 className="!font-normal !font-sans text-lg">
                                    {displayName}
                                </h3>
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
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {user.provider}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <UserIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {user.firstName} {user.lastName}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <MailIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{user.email}</span>
                            </div>

                            {user.phone && (
                                <div className="flex items-center gap-3">
                                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {user.phone}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-start justify-start gap-3">
                                <MessageSquareIcon className="mt-2 h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    {user.bio ? (
                                        <span className="text-sm">
                                            {user.bio}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground text-sm italic">
                                            {t("bio.empty")}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Preferences Card */}
                <Card className="self-start">
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
                                onCheckedChange={(value) => {
                                    prefsMutation.mutate({
                                        autoBook: value
                                    })
                                }}
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
                            <Switch
                                id="music"
                                checked={!!user.music}
                                onCheckedChange={(value) => {
                                    prefsMutation.mutate({
                                        music: value
                                    })
                                }}
                            />
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
                            <Switch
                                id="smoke"
                                checked={!!user.smoke}
                                onCheckedChange={(value) => {
                                    prefsMutation.mutate({
                                        smoke: value
                                    })
                                }}
                            />
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
                            <Switch
                                id="pets"
                                checked={!!user.pets}
                                onCheckedChange={(value) => {
                                    prefsMutation.mutate({
                                        pets: value
                                    })
                                }}
                            />
                        </div>

                        <div className="border-t pt-2">
                            <div className="flex items-center justify-between">
                                <Label
                                    className="font-medium text-sm"
                                    htmlFor="default-places"
                                >
                                    {t("preferences.default-places")}
                                </Label>
                                <InputNumber
                                    id="default-places"
                                    min={0}
                                    max={10}
                                    value={user.defaultPlaces || 0}
                                    onChange={(value) => {
                                        prefsMutation.mutate({
                                            defaultPlaces: value
                                        })
                                    }}
                                />
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
        </>
    )
}
