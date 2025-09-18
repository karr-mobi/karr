import {
    APP_URL,
    APPLICATION_NAME,
    AUTH_PROVIDERS,
    type AuthProvider
} from "@karr/config"
import logger from "@karr/logger"
import { sendEmail } from "@karr/mail"
import { ConfirmationCodeTemplate } from "@karr/mail/templates/confirmation-code"
import type { Prettify } from "@karr/util"
import { CodeProvider } from "@openauthjs/openauth/provider/code"
import { GithubProvider } from "@openauthjs/openauth/provider/github"
import { GoogleOidcProvider } from "@openauthjs/openauth/provider/google"
import { PasswordProvider } from "@openauthjs/openauth/provider/password"
import type { Provider } from "@openauthjs/openauth/provider/provider"
import { CodeUI } from "@openauthjs/openauth/ui/code"
import { PasswordUI } from "@openauthjs/openauth/ui/password"
import { isProduction } from "std-env"
import { messages } from "@/lib/messages"

export type Providers = AuthProvider["name"]

export const oauthProviders = [
    // "oauth2",
    // "apple",
    // "slack",
    // "cognito",
    // "keycloak",
    // "microsoft",
    "github"
    // "google",
    // "yahoo",
    // "twitch",
    // "facebook",
    // "jumpcloud"
] as const
export type OAuth2Provider = (typeof oauthProviders)[number]

export const oidcProviders = [
    // "oidc"
    // "apple",
    // "facebook",
    "google"
    // "microsoft"
] as const
export type OidcProvider = (typeof oidcProviders)[number]

/**
 * Returns the auth providers configured in the application.
 * @returns The auth providers
 */
function getProviders() {
    const providers: Prettify<Partial<Record<Providers, Provider>>> = {}

    for (const provider of AUTH_PROVIDERS) {
        let providerConfig = null
        if (provider.name === "password") {
            providerConfig = PasswordProvider(
                PasswordUI({
                    copy: messages.fr.password,
                    sendCode: async (email, code) => {
                        if (isProduction) {
                            await sendEmail({
                                to: email,
                                subject: `Your confirmation code is ${code}`,
                                template: ConfirmationCodeTemplate({
                                    validationCode: code,
                                    APPLICATION_NAME: APPLICATION_NAME,
                                    APP_URL: APP_URL
                                })
                            })
                        } else {
                            logger.info(`Email sent to ${email} — Code ${code}`)
                        }
                    }
                })
            )
        } else if (provider.name === "code") {
            providerConfig = CodeProvider(
                CodeUI({
                    copy: messages.fr.code,
                    sendCode: async (claims, code) => {
                        if (isProduction) {
                            await sendEmail({
                                to: claims.email as string,
                                subject: `Your confirmation code is ${code}`,
                                template: ConfirmationCodeTemplate({
                                    validationCode: code,
                                    APPLICATION_NAME: APPLICATION_NAME,
                                    APP_URL: APP_URL
                                })
                            })
                        } else {
                            logger.info(
                                `Email sent to ${claims.email} — Code ${code}`
                            )
                        }
                    }
                })
            )
        } else if (provider.name === "github") {
            const { name: _name, trusted: _trusted, ...config } = provider
            providerConfig = GithubProvider({
                scopes: ["read:user", "user:email"],
                pkce: true,
                ...config
            })
        } else if (provider.name === "google") {
            const { name: _name, trusted: _trusted, ...config } = provider
            providerConfig = GoogleOidcProvider({
                ...config,
                scopes: ["openid", "profile", "email"]
            })
        } else {
            throw new Error(`Unknown auth provider: ${provider.name}`)
        }

        providers[provider.name] = providerConfig
    }

    const providerNames = Object.keys(providers)
    logger.debug(
        `${providerNames.length} providers enabled`,
        `[${providerNames.join(", ")}]`
    )

    return providers
}

/** List of the configured providers, to be passed to OpenAuth */
export const providers = getProviders()
