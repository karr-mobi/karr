import { AUTH_PROVIDERS, type AuthProvider } from "@karr/config"
import logger from "@karr/logger"

import { PasswordProvider } from "@openauthjs/openauth/provider/password"
import { CodeProvider } from "@openauthjs/openauth/provider/code"
import { PasswordUI } from "@openauthjs/openauth/ui/password"
import { CodeUI } from "@openauthjs/openauth/ui/code"
import { GithubProvider } from "@openauthjs/openauth/provider/github"
import { GoogleOidcProvider } from "@openauthjs/openauth/provider/google"
import { Provider } from "@openauthjs/openauth/provider/provider"
import { Prettify } from "@karr/util"

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

    AUTH_PROVIDERS.forEach((provider: AuthProvider) => {
        let providerConfig = null
        if (provider.name === "password") {
            providerConfig = PasswordProvider(
                PasswordUI({
                    copy: {
                        // TODO: translate this
                        error_email_taken:
                            "This email is already taken. (translate this)",
                        button_continue: "Continue (translate this)"
                    },
                    sendCode: async (email, code) => {
                        console.log(email, code)
                    }
                })
            )
        } else if (provider.name === "code") {
            providerConfig = CodeProvider(
                CodeUI({
                    copy: {
                        code_info: "We'll send a pin code to your email"
                    },
                    sendCode: async (claims, code) =>
                        console.log(claims.email, code)
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
            /*
        } else if (provider.name === "oidc") {
            const { name: _name, ...config } = provider
            providerConfig = OidcProvider(config)
        } else if (provider.name === "oauth2") {
            const { name: _name, ...config } = provider
            providerConfig = Oauth2Provider(config)
        } else if (provider.name === "apple") {
            const { name: _name, ...config } = provider
            providerConfig = AppleProvider(config)
        } else if (provider.name === "slack") {
            const { name: _name, ...config } = provider
            providerConfig = SlackProvider(config)
        } else if (provider.name === "cognito") {
            const { name: _name, ...config } = provider
            providerConfig = CognitoProvider(config)
        } else if (provider.name === "keycloak") {
            const { name: _name, ...config } = provider
            providerConfig = KeycloakProvider(config)
        } else if (provider.name === "microsoft") {
            const { name: _name, ...config } = provider
            providerConfig = MicrosoftProvider(config)
        } else if (provider.name === "yahoo") {
            const { name: _name, ...config } = provider
            providerConfig = YahooProvider(config)
        } else if (provider.name === "twitch") {
            const { name: _name, ...config } = provider
            providerConfig = TwitchProvider(config)
        } else if (provider.name === "facebook") {
            const { name: _name, ...config } = provider
            providerConfig = FacebookProvider(config)
        } else if (provider.name === "jumpcloud") {
            const { name: _name, ...config } = provider
            providerConfig = JumpCloudProvider(config)
         */
        } else {
            throw new Error(`Unknown auth provider: ${provider.name}`)
        }

        providers[provider.name] = providerConfig
    })

    const providerNames = Object.keys(providers)
    logger.debug(
        `${providerNames.length} providers enabled`,
        `[${providerNames.join(", ")}]`
    )

    return providers
}

/** List of the configured providers, to be passed to OpenAuth */
export const providers = getProviders()
