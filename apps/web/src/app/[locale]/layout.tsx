import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { routing } from "@/i18n/routing"
import { Locale } from "@/../global"

export async function generateMetadata() {
    const t = await getTranslations("HomePage")
    return {
        description: t("slogan")
    } as Metadata
}

export default async function I18nLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode
    params: Promise<{ locale: Locale }>
}>) {
    const { locale } = await params

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale)) {
        notFound()
    }

    return children
}
