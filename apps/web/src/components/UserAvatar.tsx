"use server"

import { Avatar, AvatarFallback } from "@karr/ui/components/avatar"
import { UserIcon } from "lucide-react"
import { Suspense } from "react"
import { RenderAvatar } from "./UserAvatarClient"

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
            <Avatar className="size-10">
                <AvatarFallback>
                    <UserIcon className="size-10 rounded-full" />
                </AvatarFallback>
                <RenderAvatar userId={userId} />
            </Avatar>
        </Suspense>
    )
}
