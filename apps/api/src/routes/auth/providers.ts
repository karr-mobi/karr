import { AUTH_PROVIDERS, type AuthProviders } from "@karr/config"
import logger from "@karr/logger"

import { PasswordProvider } from "@openauthjs/openauth/provider/password"
import { CodeProvider } from "@openauthjs/openauth/provider/code"
import { PasswordUI } from "@openauthjs/openauth/ui/password"
import { CodeUI } from "@openauthjs/openauth/ui/code"
import { OidcProvider } from "@openauthjs/openauth/provider/oidc"
import { Oauth2Provider } from "@openauthjs/openauth/provider/oauth2"
import { AppleProvider } from "@openauthjs/openauth/provider/apple"
import { SlackProvider } from "@openauthjs/openauth/provider/slack"
import { CognitoProvider } from "@openauthjs/openauth/provider/cognito"
import { KeycloakProvider } from "@openauthjs/openauth/provider/keycloak"
import { MicrosoftProvider } from "@openauthjs/openauth/provider/microsoft"
import { GithubProvider } from "@openauthjs/openauth/provider/github"
import { GoogleProvider } from "@openauthjs/openauth/provider/google"
import { YahooProvider } from "@openauthjs/openauth/provider/yahoo"
import { TwitchProvider } from "@openauthjs/openauth/provider/twitch"
import { FacebookProvider } from "@openauthjs/openauth/provider/facebook"
import { JumpCloudProvider } from "@openauthjs/openauth/provider/jumpcloud"
import { Provider } from "@openauthjs/openauth/provider/provider"
import { Prettify } from "@karr/util"

export type Providers = AuthProviders[number]["name"]

/**
 * Returns the auth providers configured in the application.
 * @returns The auth providers
 */
function getProviders() {
    const providers: Prettify<Partial<Record<Providers, Provider>>> = {}

    AUTH_PROVIDERS.forEach((provider) => {
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
        } else if (provider.name === "github") {
            const { name: _name, ...config } = provider
            providerConfig = GithubProvider(config)
        } else if (provider.name === "google") {
            const { name: _name, ...config } = provider
            providerConfig = GoogleProvider(config)
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
        } else {
            throw new Error(`Unknown auth provider: ${provider.name}`)
        }

        providers[provider.name] = providerConfig
    })

    logger.debug("auth providers", providers)

    return providers
}

/** List of the configured providers, to be passed to OpenAuth */
export const providers = getProviders()
