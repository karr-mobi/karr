"use client"

import type { InferResponseType } from "@karr/api/client"
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
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@karr/ui/components/dialog"
import { Skeleton } from "@karr/ui/components/skeleton"
import { toast } from "@karr/ui/components/sonner"
import { useDisplayName } from "@karr/ui/hooks/users"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Ban, Calendar1Icon, CircleCheckIcon, UserIcon } from "lucide-react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { useAuth } from "@/app/auth/context"
import { client } from "@/util/apifetch"

type Users = InferResponseType<typeof client.admin.users.$get, 200>

function useBlockMutations() {
    const queryClient = useQueryClient()

    const blockUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            const res = await client.admin.users[":id"].block.$post({
                param: { id: userId }
            })
            if (res.status !== 200) {
                throw new Error("Failed to block user", {
                    cause: await res.json()
                })
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
            toast.success("User blocked successfully")
        },
        onError: (error) => {
            console.error("Failed to block user:", error)
            toast.error("Failed to block user")
        }
    })

    const unblockUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            const res = await client.admin.users[":id"].unblock.$post({
                param: { id: userId }
            })
            if (res.status !== 200) {
                throw new Error("Failed to unblock user", {
                    cause: await res.json()
                })
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
            toast.success("User unblocked successfully")
        },
        onError: (error) => {
            console.error("Failed to unblock user:", error)
            toast.error("Failed to unblock user")
        }
    })

    return { blockUserMutation, unblockUserMutation }
}

function UsersSkeleton() {
    return ["skeleton-1", "skeleton-2", "skeleton-3"].map((id) => (
        <div
            key={id}
            className="group mb-4 flex items-center justify-between rounded-lg border bg-card p-4"
        >
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                    <div className="mt-1 flex items-center gap-2">
                        <Skeleton className="h-4 w-25 rounded-full" />
                        <Skeleton className="h-4 w-15 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    ))
}

function UserCard({ user }: { user: Users[number] }) {
    const { authState } = useAuth()
    const displayName = useDisplayName(user)
    const t = useTranslations("Admin")

    return (
        <>
            <div className="flex w-full items-center justify-start gap-2 font-medium">
                {user.avatar ? (
                    <Image
                        src={user.avatar}
                        alt={displayName}
                        className="me-2 h-10 w-10 rounded-full"
                        width="40"
                        height="40"
                    />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <UserIcon className="h-5 w-5" />
                    </div>
                )}
                {user.profileId === authState?.id && (
                    <Badge variant="secondary">{t("you")}</Badge>
                )}
                <div>{displayName}</div>
                {user.role === "admin" && (
                    <Badge variant="default">{user.role}</Badge>
                )}
                {user.blocked && (
                    <Badge variant="destructive">{t("blocked")}</Badge>
                )}
            </div>
        </>
    )
}

function User({ user }: { user: Users[number]; key: string }) {
    const { blockUserMutation, unblockUserMutation } = useBlockMutations()

    const displayName = useDisplayName(user)
    const t = useTranslations("Admin")
    const locale = useLocale()

    return (
        <Dialog key={user.id}>
            <DialogTrigger asChild>
                <div className="group flex w-full cursor-pointer items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50 md:w-[49%]">
                    <DialogTitle className="sr-only">
                        {t("open-user-details")}
                    </DialogTitle>
                    <UserCard user={user} />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-4">
                        {user.avatar ? (
                            <Image
                                src={user.avatar}
                                alt={displayName}
                                className="h-10 w-10 rounded-full"
                                width="40"
                                height="40"
                            />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                <UserIcon className="h-5 w-5" />
                            </div>
                        )}
                        {displayName}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="mt-1 flex items-center gap-2">
                        {user.role === "admin" && (
                            <Badge variant="default">{user.role}</Badge>
                        )}
                        <Badge variant="outline" className="capitalize">
                            {user.provider}
                        </Badge>
                        {user.blocked && (
                            <Badge variant="destructive">{t("blocked")}</Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm capitalize">
                            {`${user.firstName} `}
                            {user.lastName}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Calendar1Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                            {t("joined", {
                                date: new Date(
                                    user.createdAt
                                ).toLocaleDateString(locale)
                            })}
                        </span>
                    </div>

                    {user.role === "user" && (
                        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-start">
                            {user.blocked ? (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                        unblockUserMutation.mutate(user.id)
                                    }
                                    disabled={unblockUserMutation.isPending}
                                >
                                    <CircleCheckIcon className="mr-1 h-4 w-4" />
                                    {t("unblock")}
                                </Button>
                            ) : (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                        blockUserMutation.mutate(user.id)
                                    }
                                    disabled={blockUserMutation.isPending}
                                >
                                    <Ban className="mr-1 h-4 w-4" />
                                    {t("block")}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function UsersList() {
    const t = useTranslations("Admin")

    const {
        data: users,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["admin", "users"],
        queryFn: async () => {
            const res = await client.admin.users.$get()
            if (res.status !== 200) {
                throw new Error("Failed to fetch users", {
                    cause: await res.json()
                })
            }
            return res.json()
        }
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    {t("users")}
                </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pt-0 pb-6 md:px-6">
                {isLoading ? (
                    <UsersSkeleton />
                ) : isError || !users ? (
                    <div className="py-8 text-center text-red-500">
                        {t("failed-load-users")}:{" "}
                        {error?.message || "Unknown error"}
                    </div>
                ) : (
                    <div className="flex flex-row flex-wrap gap-2">
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <User user={user} key={user.id} />
                            ))
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">
                                {t("no-users-found")}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
