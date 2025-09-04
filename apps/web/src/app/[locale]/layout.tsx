import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { en, fr } from "zod/locales"
import { z } from "zod/mini"
import type { Locale } from "@/../global"
import { routing } from "@/i18n/routing"

export async function generateMetadata() {
    const t = await getTranslations("HomePage")
    return {
        description: t("slogan")
    } satisfies Metadata
}

export default async function I18nLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode
    params: Promise<{ locale: string }>
}>) {
    const { locale } = await params

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as Locale)) {
        notFound()
    }

    z.config(locale === "en-GB" ? en() : fr())

    return children
}
