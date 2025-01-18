"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"

import { Badge } from "@karr/ui/components/badge"

import { QueryProvider } from "@/components/QueryProvider"
import { apiFetch } from "@/util/apifetch"

export default function UserInfo({ userid }: { userid: string }) {
    return (
        <QueryProvider>
            <FetchUserData userid={userid} />
        </QueryProvider>
    )
}

function FetchUserData({ userid }: { userid: string }) {
    // Access the client
    const _queryClient = useQueryClient()

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["user", userid],
        retry: false,
        queryFn: async () =>
            apiFetch("/user", {
                headers: {
                    authorization: userid
                }
            })
    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error: {error.message}</div>
    }

    return <ShowUserData user={data} />
}

// TODO: add user type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ShowUserData({ user: { data: user } }: { user: any }) {
    const hasSpecialStatus = user.SpecialStatus?.id || false

    console.log(user)

    return (
        <div>
            <h2>User</h2>
            <section className="flow">
                {!hasSpecialStatus && (
                    <Badge variant="destructive">
                        <p>{user.SpecialStatus?.name || "No special status"}</p>
                    </Badge>
                )}
                <div className="flex flex-row gap-6">
                    <b>User ID</b>
                    <p>{user.id}</p>
                </div>
                <div className="flex flex-row gap-6">
                    <b>Full Name</b>
                    <p>
                        {user.firstName} {user.lastName}
                    </p>
                </div>
                <div className="flex flex-row gap-6">
                    <b>Username</b>
                    <p>{user.nickname ?? "No nickname"}</p>
                </div>
            </section>
            <details>
                <summary>See raw</summary>
                <pre>{JSON.stringify(user, null, 2)}</pre>
            </details>
        </div>
    )
}
