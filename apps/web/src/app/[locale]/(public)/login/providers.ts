import "server-only"
import { AUTH_PROVIDERS } from "@karr/config"

export const PROVIDERS = Object.values(AUTH_PROVIDERS).map(
    (provider) => provider.name
)
