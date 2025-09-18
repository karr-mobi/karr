import { CALLBACK_URL } from "@karr/auth/client"
import { basePath } from "@karr/auth/issuer-config"
import { subjects, type UserProperties } from "@karr/auth/subjects"
import { getOpenAuthStorage } from "@karr/kv"
import { logger } from "@karr/logger"
import { issuer } from "@openauthjs/openauth"
import type { Theme } from "@openauthjs/openauth/ui/theme"
import { ok, type Result } from "neverthrow"
import { runtime } from "std-env"
import { getGithubUserData } from "./profile-fetchers/github"
import { getGoogleUserData } from "./profile-fetchers/google"
import { providers } from "./providers"
import type { SuccessValues } from "./sucess"

const theme: Theme = {
    title: "Karr Auth",
    logo: "https://demo.karr.mobi/logo-tmp.jpg",
    background: {
        dark: "hsl(132 2% 10%)",
        light: "hsl(140 20% 97%)"
    },
    primary: {
        dark: "hsl(132 74% 32%)",
        light: "hsl(132 64% 32%)"
    },
    font: {
        family: "Varela Round, sans-serif"
    },
    css: `
        html {
            --border-radius: 2.8 !important;
        }
    `
}

const storage = await getOpenAuthStorage()

if (storage.isErr()) {
    throw new Error("Failed to initialize storage")
}

logger.debug("issuer config", { CALLBACK_URL, base: basePath })

const app = issuer({
    basePath,
    providers,
    storage: storage.value,
    subjects,
    theme,
    allow(input, _req) {
        return Promise.resolve(
            input.redirectURI === CALLBACK_URL && input.clientID === "karr"
        )
    },
    async success(ctx, value: SuccessValues) {
        let subjectData: Result<UserProperties, string>
        if (value.provider === "password") {
            subjectData = ok({
                provider: "local",
                email: value.email,
                remoteId: value.email
            })
        } else if (value.provider === "code") {
            subjectData = ok({
                provider: "local",
                email: value.claims.email,
                remoteId: value.claims.email
            })
        } else if (value.provider === "github") {
            subjectData = await getGithubUserData(value.tokenset.access)

            if (subjectData.isErr()) {
                logger.error(
                    `[${runtime}] Error getting GitHub user data: ${subjectData.error}`
                )
            }
        } else if (value.provider === "google") {
            subjectData = getGoogleUserData(value.id)
        } else {
            // should never happen
            logger.debug(`[${runtime}] Unknown provider`, value)
            throw new Error("Invalid provider")
        }

        if (subjectData.isErr()) {
            logger.error(
                `[${runtime}] Error creating subject data: ${subjectData.error}`
            )
            throw new Error(subjectData.error)
        }

        return ctx.subject("user", subjectData.value)
    }
})

export default app
