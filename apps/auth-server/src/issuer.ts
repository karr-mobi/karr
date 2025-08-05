import { authBaseUrl } from "@karr/auth/client"
import { subjects, type UserProperties } from "@karr/auth/subjects"
import { API_BASE } from "@karr/config"
import { getOpenAuthStorage } from "@karr/kv"
import { logger } from "@karr/logger"
import { issuer } from "@openauthjs/openauth"
import type { Theme } from "@openauthjs/openauth/ui/theme"
import { ok, type Result } from "neverthrow"
import { runtime } from "std-env"
import { callbackUrl } from "./client"
import { getGithubUserData } from "./profile-fetchers/github"
import { getGoogleUserData } from "./profile-fetchers/google"
import { providers } from "./providers"
import type { SuccessValues } from "./sucess"

const theme: Theme = {
    title: "Karr Auth",
    logo: "/logo-tmp.jpg",
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

logger.debug("issuer config", { callbackUrl, base: authBaseUrl(API_BASE) })

const app = issuer({
    basePath: authBaseUrl(API_BASE),
    providers,
    storage: storage.value,
    subjects,
    theme,
    allow(input, _req) {
        return Promise.resolve(
            input.redirectURI === callbackUrl && input.clientID === "karr"
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
            // subjectData = await getOrInsertUser({
            //     provider: value.provider,
            //     email: value.email
            // })
        } else if (value.provider === "code") {
            subjectData = ok({
                provider: "local",
                email: value.claims.email,
                remoteId: value.claims.email
            })
            // subjectData = await getOrInsertUser({
            //     provider: value.provider,
            //     email: value.claims.email
            // })
        } else if (value.provider === "github") {
            subjectData = await getGithubUserData(value.tokenset.access)

            if (subjectData.isErr()) {
                logger.error(
                    `[${runtime}] Error getting GitHub user data: ${subjectData.error}`
                )
            }

            // subjectData = await getOrInsertUser(userData.value)
        } else if (value.provider === "google") {
            subjectData = getGoogleUserData(value.id)
            // subjectData = await getOrInsertUser(userData.value)
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
