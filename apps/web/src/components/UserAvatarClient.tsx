"use client"

import { AvatarImage } from "@karr/ui/components/avatar"
import { useSuspenseQuery } from "@tanstack/react-query"
import { orpc } from "@/lib/orpc"

export function RenderAvatar({ userId }: { userId?: string }) {
    const { data, error } = useSuspenseQuery(
        orpc.user.avatar.queryOptions({
            input: userId
        })
    )

    if (error) {
        return
    }

    return <AvatarImage src={data.avatar ?? undefined} />
}
