"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { orpc } from "@/lib/orpc"
import { User } from "./User"

export function UsersList() {
    const t = useTranslations("Admin")

    const {
        data: users,
        isError,
        error
    } = useSuspenseQuery(orpc.admin.users.queryOptions())

    if (isError || !users) {
        return (
            <div className="py-8 text-center text-red-500">
                {t("failed-load-users")}: {error?.message || "Unknown error"}
            </div>
        )
    }

    return (
        <div className="flex flex-row flex-wrap gap-2">
            {users && users.length > 0 ? (
                users.map((user) => <User user={user} key={user.id} />)
            ) : (
                <div className="py-8 text-center text-muted-foreground">
                    {t("no-users-found")}
                </div>
            )}
        </div>
    )
}
