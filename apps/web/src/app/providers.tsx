// app/providers.js
"use client"

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

const phog: boolean =
    process.env.NEXT_PUBLIC_POSTHOG_KEY !== undefined &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST !== undefined

if (typeof window !== "undefined" && phog) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: "identified_only" // or 'always' to create profiles for anonymous users as well
    })
}
export function CSPostHogProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    if (!phog) {
        return <>{children}</>
    }
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
