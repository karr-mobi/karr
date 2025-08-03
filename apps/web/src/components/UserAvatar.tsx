"use server"

import { Avatar, AvatarFallback, AvatarImage } from "@karr/ui/components/avatar"
import { UserIcon } from "lucide-react"
import { Suspense } from "react"
import { client } from "@/lib/orpc"

async function RenderAvatar({ userId }: { userId?: string }) {
    const data = await client.user.avatar(userId)

    return (
        <Avatar className="size-10">
            <AvatarImage src={data.avatar ?? undefined} />
            <AvatarFallback>
                <UserIcon className="size-10 rounded-full" />
            </AvatarFallback>
        </Avatar>
    )
}

// biome-ignore lint/suspicious/useAwait: needs to be async
export async function UserAvatar({ userId }: { userId?: string }) {
    return (
        <Suspense
            fallback={
                <div>
                    <UserIcon className="size-10 rounded-full" />
                </div>
            }
        >
            <RenderAvatar userId={userId} />
        </Suspense>
    )
}
