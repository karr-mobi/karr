"use client"

import { useLocale } from "next-intl"

import { Button } from "@karr/ui/components/button"

import { routing, usePathname, useRouter } from "@/i18n/routing"

export default function LocaleSwitcher() {
    const allLocales = routing.locales
    const locale = useLocale() as "en" | "fr"
    const router = useRouter()
    const pathname = usePathname()

    const switchLocale = () => {
        const currentIndex = allLocales.indexOf(locale)
        const nextIndex = (currentIndex + 1) % allLocales.length
        const nextLocale = allLocales[nextIndex]

        router.push(pathname, { locale: nextLocale })
    }

    return (
        <Button variant="outline" size="icon" onClick={switchLocale}>
            {locale}
        </Button>
    )
}
