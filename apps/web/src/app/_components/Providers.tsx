"use client"

import { StandardRPCJsonSerializer } from "@orpc/client/standard"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"

const serializer = new StandardRPCJsonSerializer({
    customJsonSerializers: [
        // put custom serializers here
    ]
})

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000 // > 0 to prevent immediate refetching on mount
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
                {children}
            </ThemeProvider>
        </QueryClientProvider>
    )
}
