"use client"

import { Button } from "@karr/ui/components/button"
import { useTranslations } from "next-intl"
import { useEffect } from "react"

export default function ErrorPage({
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
        <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 text-center">
            <p className="font-semibold text-indigo-600 text-sm">
                {t("title", { name: error.name })}
            </p>
            <p className="mt-2 text-sm">{t("message")}</p>
            <Button onClick={reset}>Refresh</Button>
        </div>
    )
}
