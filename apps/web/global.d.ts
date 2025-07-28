import type { formats } from "@/i18n/request"
import type { routing } from "@/i18n/routing"

import messages from "./messages/en.json" with { type: "json" }

export type Locale = (typeof routing.locales)[number]

export type Messages = typeof messages

declare module "next-intl" {
    interface AppConfig {
        Locale: locale
        Messages: Messages
        Formats: typeof formats
    }
}
