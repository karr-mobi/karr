"use client"

import { isDefinedError } from "@orpc/client"
import { useQuery } from "@tanstack/react-query"
import { useTransition } from "react"
import { logout } from "@/lib/auth/actions"
import { orpc } from "@/lib/orpc"

export function useAvatar(userId?: string) {
    return useQuery(
        orpc.user.avatar.queryOptions({
            input: userId
        })
    )
}

export function useUser() {
    const userQuery = useQuery(orpc.user.info.queryOptions())

    const [, startTransition] = useTransition()

    if (userQuery.isError) {
        console.error("Failed to fetch user info", userQuery.error)
        if (
            isDefinedError(userQuery.error) &&
            (userQuery.error.code === "NOT_FOUND" ||
                userQuery.error.code === "UNAUTHORIZED")
        ) {
            startTransition(logout)
        }
    }

    return userQuery
}
