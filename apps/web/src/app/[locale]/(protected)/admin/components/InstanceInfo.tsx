"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import { Skeleton } from "@karr/ui/components/skeleton"
import { useSuspenseQuery } from "@tanstack/react-query"
import { UsersIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { orpc } from "@/lib/orpc"

export function InstanceInfo() {
    const t = useTranslations("Admin")
    const locale = useLocale()

    // Fetch instance information
    const {
        data: instanceInfo,
        isLoading,
        isError,
        error
    } = useSuspenseQuery(
        orpc.admin.instance.queryOptions({
            staleTime: 60 * 1000
        })
    )

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-medium text-sm">
                        {t("total-users")}
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
                        {t("registered-users")}
                    </p>
                </CardContent>
            </Card>

            {instanceInfo?.timestamp && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            {t("instance-created")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">
                            {new Date(
                                instanceInfo.timestamp
                            ).toLocaleDateString(locale)}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            {new Date(
                                instanceInfo.timestamp
                            ).toLocaleTimeString(locale)}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Error State for Instance Info */}
            {isError && (
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">
                            {t("error-loading-instance-data")}
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
