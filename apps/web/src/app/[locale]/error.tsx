"use client"

import { useEffect } from "react"

import { Button } from "@karr/ui/components/button"

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
            <p className="text-sm font-semibold text-indigo-600">Error {error.name}</p>
            <p className="mt-2 text-sm">Sorry, an unexpected error has occurred.</p>
            <Button onClick={reset}>Refresh</Button>
        </div>
    )
}
