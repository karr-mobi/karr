"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@karr/ui/components/select"
import { cn } from "@karr/ui/lib/utils"
import { useLocale, useTranslations } from "next-intl"
import { useCallback, useId } from "react"
import type { Locale } from "@/../global"

import { routing, usePathname, useRouter } from "@/i18n/routing"

const Square = ({
    className,
    children
}: {
    className?: string
    children: React.ReactNode
}) => (
    <span
        data-square
        className={cn(
            "flex size-5 items-center justify-center rounded font-medium text-xs",
            className
        )}
        aria-hidden="true"
    >
        {children}
    </span>
)

function LocaleSwitcher() {
    const id = useId()

    const t = useTranslations("Footer")

    const allLocales = routing.locales
    const locale = useLocale() as Locale
    const router = useRouter()
    const pathname = usePathname()

    const localeIcons = {
        //biome-ignore format: breaks emoji
        en: "🇬🇧",
        //biome-ignore format: breaks emoji
        fr: "🇫🇷"
    }

    const localeNames = {
        en: "English (UK)",
        fr: "Français (FR)"
    }

    const switchLocale = useCallback(() => {
        const currentIndex = allLocales.indexOf(locale)
        const nextIndex = (currentIndex + 1) % allLocales.length
        const nextLocale = allLocales[nextIndex]

        router.push(pathname, { locale: nextLocale })

        window.location.reload()
    }, [allLocales, locale, router, pathname])

    return (
        <Select defaultValue={locale} onValueChange={switchLocale}>
            <SelectTrigger
                id={id}
                className="cursor-pointer ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_[data-square]]:shrink-0"
            >
                <SelectValue placeholder="Select locale">
                    {localeIcons[locale]}
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
                <SelectGroup>
                    <SelectLabel className="ps-2">
                        {t("select-locale")}
                    </SelectLabel>
                    {allLocales.map((l) => (
                        <SelectItem value={l} key={l}>
                            <Square>{localeIcons[l]}</Square>
                            <span className="truncate">{localeNames[l]}</span>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export { LocaleSwitcher }
