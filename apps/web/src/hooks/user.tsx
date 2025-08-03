"use client"

import { useQuery } from "@tanstack/react-query"
import { orpc } from "@/lib/orpc"

export function useAvatar(userId?: string) {
    return useQuery(
        orpc.user.avatar.queryOptions({
            input: userId
        })
    )
}

export function useUser() {
    return useQuery(orpc.user.info.queryOptions())
}
