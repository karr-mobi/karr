"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@karr/ui/components/button"

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const t = useTranslations("Errors.500")

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="w-full flex min-h-screen flex-col items-center justify-center px-4 text-center">
            <p className="text-sm font-semibold text-indigo-600">
                {t("title", { name: error.name })}
            </p>
            <p className="mt-2 text-sm">{t("message")}</p>
            <Button onClick={reset}>Refresh</Button>
        </div>
    )
}
