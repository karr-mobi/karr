"use client"

import process from "node:process"
import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"
import { PostHogProvider as PhProvider, usePostHog } from "posthog-js/react"
import { Suspense, useEffect } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const env = process.env
        posthog.init((env.NEXT_PUBLIC_POSTHOG_KEY as string) || "", {
            api_host:
                env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
            person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
            capture_pageview: false // Disable automatic pageview capture, as we capture manually
        })
    }, [])

    return (
        <PhProvider client={posthog}>
            <SuspendedPostHogPageView />
            {children}
        </PhProvider>
    )
}

function PostHogPageView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const posthog = usePostHog()

    // Track pageviews
    useEffect(() => {
        if (pathname && posthog) {
            let url = window.origin + pathname
            if (searchParams.toString()) {
                url += `?${searchParams.toString()}`
            }

            //biome-ignore lint/style/useNamingConvention: this is the naming convention used by Posthog
            posthog.capture("$pageview", { $current_url: url })
        }
    }, [pathname, searchParams, posthog])

    return null
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
    return (
        <Suspense fallback={null}>
            <PostHogPageView />
        </Suspense>
    )
}
