"use client"

import { Badge } from "@karr/ui/components/badge"
import { Button } from "@karr/ui/components/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import { Skeleton } from "@karr/ui/components/skeleton"
import { toast } from "@karr/ui/components/sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Ban, UserIcon } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/app/auth/context"
import { client } from "@/util/apifetch"

interface User {
    id: string
    name?: string | null
    avatar?: string | null
    role: "user" | "admin"
    createdAt: string
    blocked?: boolean | null
    provider: string
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
                    <div className="font-medium">
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                        <Skeleton className="h-4 w-20 rounded-full" />
                        <Skeleton className="h-4 w-20 rounded-full" />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">
                    <Skeleton className="h-4 w-20" />
                </span>
            </div>
        </div>
    ))
}

function Users({ users }: { users: User[] }) {
    const queryClient = useQueryClient()
    const { authState } = useAuth()

    console.log(authState?.id)

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

    return users.map((user) => (
        <div
            key={user.id}
            className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
        >
            <div className="flex items-center gap-4">
                {user.avatar ? (
                    <Image
                        src={user.avatar}
                        alt={user.name || "User"}
                        className="h-10 w-10 rounded-full"
                        width="40"
                        height="40"
                    />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <UserIcon className="h-5 w-5" />
                    </div>
                )}
                <div>
                    <div className="flex flex-col flex-wrap items-start justify-start gap-2 font-medium sm:flex-row sm:items-center">
                        {user.id === authState?.id && (
                            <Badge variant="secondary">You</Badge>
                        )}
                        <div className="max-w-[30vw]">{user.name}</div>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                        <Badge
                            variant={
                                user.role === "admin" ? "default" : "secondary"
                            }
                        >
                            {user.role}
                        </Badge>
                        <Badge variant="outline">{user.provider}</Badge>
                        {user.blocked && (
                            <Badge variant="destructive">Blocked</Badge>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 self-end">
                {user.role === "user" &&
                    (user.blocked ? (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => unblockUserMutation.mutate(user.id)}
                            disabled={unblockUserMutation.isPending}
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            Unblock
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => blockUserMutation.mutate(user.id)}
                            disabled={blockUserMutation.isPending}
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <Ban className="mr-1 h-4 w-4" />
                            Block
                        </Button>
                    ))}
                <div className="max-w-[30vw] text-right text-muted-foreground text-sm">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    ))
}

export function UsersList() {
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
                    Users
                </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pt-0 pb-6 md:px-6">
                {isLoading ? (
                    <UsersSkeleton />
                ) : isError || !users ? (
                    <div className="py-8 text-center text-red-500">
                        Failed to load users:{" "}
                        {error?.message || "Unknown error"}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {users && users.length > 0 ? (
                            <Users users={users} />
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">
                                No users found
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
