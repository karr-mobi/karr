"use client"

import { useEffect, useState } from "react"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

export function CSPostHogProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [posthogLoaded, setPosthogLoaded] = useState(false)

    useEffect(() => {
        // Check for PostHog configuration on the client side
        if (
            typeof window !== "undefined" &&
            process.env.NEXT_PUBLIC_POSTHOG_KEY &&
            process.env.NEXT_PUBLIC_POSTHOG_HOST &&
            !posthogLoaded
        ) {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
                person_profiles: "identified_only"
            })
            setPosthogLoaded(true)
        }
    }, [posthogLoaded])

    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !process.env.NEXT_PUBLIC_POSTHOG_HOST) {
        return <>{children}</>
    }

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
