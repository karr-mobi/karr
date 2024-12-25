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

export default function UserInfo() {
    return (
        <QueryClientProvider client={queryClient}>
            <Data />
        </QueryClientProvider>
    )
}

function Data() {
    // Access the client
    const _queryClient = useQueryClient()

    const { data: user } = useQuery({
        queryKey: ["user"],
        queryFn: () => {
            const f = fetch(`${process.env.NEXT_PUBLIC_API_ROUTE}/user`, {
                headers: {
                    authorization: "dc707395-cd78-4f10-ad18-5eaaf18478ac"
                }
            }).then((res) => res.json())
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
