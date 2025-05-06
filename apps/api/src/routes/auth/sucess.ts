import type { Prettify } from "@karr/util"
import { type OAuth2Provider } from "./providers"
import type { JWTPayload } from "hono/utils/jwt/types"

export type SuccessValues = Prettify<
    | CodeSuccessValue
    | PasswordSuccessValue
    | GoogleSuccessValue
    | OAuth2SuccessValue
    // | ArcticSuccessValue
>

type CodeSuccessValue = {
    provider: "code"
    claims: { email: string } & Record<string, string>
}

type PasswordSuccessValue = {
    provider: "password"
    email: string
}

export type GoogleSuccessValue = {
    provider: "google"
    id: Prettify<
        JWTPayload & {
            iss: string
            azp: string
            aud: string
            sub: string
            email: string
            email_verified: boolean
            nonce: string
            name: string
            picture: string
            given_name: string
            family_name: string
            jti: string
        }
    >
    clientID: string
}

type OAuth2SuccessValue = {
    provider: OAuth2Provider
    clientID: string
    tokenset: {
        access: string
        refresh: string
        expiry: number
        raw: Record<string, unknown>
    }
}

// For the Arctic provider
type _ArcticSuccessValue = {
    provider: "arctic"
    tokenset: {
        accessToken: string
        refreshToken?: string
        idToken?: string
        tokenType: string
        expiresIn?: number
        expiresAt?: Date
        scopes?: string[]
        [key: string]: unknown
    }
}
