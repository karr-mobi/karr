import "server-only"
import { AUTH_PROVIDERS } from "@karr/config"

export const OAuthProviders: (typeof AUTH_PROVIDERS)[number]["name"][] = []

export const LocalProviders: (typeof AUTH_PROVIDERS)[number]["name"][] = []

for (const provider of AUTH_PROVIDERS) {
    if (provider.name === "password" || provider.name === "code") {
        LocalProviders.push(provider.name)
    } else {
        OAuthProviders.push(provider.name)
    }
}
