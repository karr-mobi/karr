"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import { Skeleton } from "@karr/ui/components/skeleton"
import { useQuery } from "@tanstack/react-query"
import { UsersIcon } from "lucide-react"
import { client } from "@/util/apifetch"

interface InstanceInfo {
    userCount: number
    createdAt?: string
}

export function InstanceInfo() {
    // Fetch instance information
    const {
        data: instanceInfo,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["admin", "instance"],
        queryFn: async () => {
            const res = await client.admin.instance.$get()
            if (res.status !== 200) {
                throw new Error("Failed to fetch instance data", {
                    cause: await res.json()
                })
            }
            return (await res.json()) as InstanceInfo
        }
    })

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">
                        Total Users
                    </CardTitle>
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="font-bold text-2xl">
                        {isLoading ? (
                            <Skeleton className="mb-2 h-[calc(2ch-(var(--spacing)*3))] w-[2ch]" />
                        ) : isError ? (
                            "Error"
                        ) : (
                            instanceInfo?.userCount
                        )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                        Registered users
                    </p>
                </CardContent>
            </Card>

            {instanceInfo?.createdAt && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Instance Created
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">
                            {new Date(
                                instanceInfo.createdAt
                            ).toLocaleDateString()}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            {new Date(
                                instanceInfo.createdAt
                            ).toLocaleTimeString()}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Error State for Instance Info */}
            {isError && (
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">
                            Error Loading Instance Data
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">
                            {error?.message ||
                                "Failed to load instance information"}
                        </p>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
