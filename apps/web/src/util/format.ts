import { useLocale } from "next-intl"

export function formatDate(dateString) {
    const locale = useLocale()

    return new Date(dateString).toLocaleDateString(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}

export function formatTime(dateString: string) {
    const locale = useLocale()

    return new Date(dateString).toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit"
    })
}
