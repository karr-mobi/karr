"use client"

import {
    useMutation as _useMutation,
    QueryClient,
    QueryClientProvider,
    useQuery,
    useQueryClient
} from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient()

export default function UserInfo({
    apiVersion
}: Readonly<{ apiVersion: string }>) {
    return (
        <QueryClientProvider client={queryClient}>
            <Data apiVersion={apiVersion} />
        </QueryClientProvider>
    )
}

function Data({ apiVersion }: Readonly<{ apiVersion: string }>) {
    // Access the client
    const _queryClient = useQueryClient()

    const { data: user } = useQuery({
        queryKey: ["user", apiVersion],
        queryFn: () => {
            const f = fetch(`/api/${apiVersion}/user`).then((res) => res.json())
            console.log(f)
            return f
        }
    })

    return (
        <div>
            <h2>User</h2>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    )
}
