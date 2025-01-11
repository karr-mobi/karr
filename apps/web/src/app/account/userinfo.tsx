"use client"

import { QueryProvider } from "@/components/QueryProvider"
import { apiFetch } from "@/util/apifetch"
import { useQuery, useQueryClient } from "@tanstack/react-query"

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
    const hasSpecialStatus = user.SpecialStatus?.id

    return (
        <div>
            <h2>User</h2>
            <section>
                {!hasSpecialStatus && (
                    <div className="w-fit rounded-full bg-red-500 px-2 py-0 text-sm text-white">
                        <p>{user.SpecialStatus?.name || "No special status"}</p>
                    </div>
                )}
                <div className="flex flex-row gap-6">
                    <h3>User ID</h3>
                    <p>{user.Users.id}</p>
                </div>
                <div className="flex flex-row gap-6">
                    <h3>Full Name</h3>
                    <p>
                        {user.Users.firstName} {user.Users.lastName}
                    </p>
                </div>
                <div className="flex flex-row gap-6">
                    <h3>Username</h3>
                    <p>{user.Users.nickname ?? "No nickname"}</p>
                </div>
            </section>
            <details>
                <summary>See raw</summary>
                <pre>{JSON.stringify(user, null, 2)}</pre>
            </details>
        </div>
    )
}
