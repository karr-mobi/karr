"use client"

import { StandardRPCJsonSerializer } from "@orpc/client/standard"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { NuqsAdapter } from "nuqs/adapters/next/app"

const serializer = new StandardRPCJsonSerializer({
    customJsonSerializers: [
        // put custom serializers here
    ]
})

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1 * 1000 // 1min (> 0 to prevent immediate refetching on mount)
        },
        dehydrate: {
            serializeData(data) {
                const [json, meta] = serializer.serialize(data)
                return { json, meta }
            }
        },
        hydrate: {
            deserializeData(data) {
                return serializer.deserialize(data.json, data.meta)
            }
        }
    }
})

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <NuqsAdapter>{children}</NuqsAdapter>
            </ThemeProvider>
        </QueryClientProvider>
    )
}
