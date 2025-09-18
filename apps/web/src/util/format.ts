import { useLocale } from "next-intl"

export function useFormatDate(dateString: string) {
    const locale = useLocale()

    return new Date(dateString).toLocaleDateString(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}

export function useFormatTime(dateString: string) {
    const locale = useLocale()

    return new Date(dateString).toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit"
    })
}
