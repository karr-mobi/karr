import { Prettify } from "@karr/util"
import { oauthProviders, type OAuth2Provider } from "../providers"

export type OAuthProfileData = {
    provider: OAuth2Provider
    email: string
    remoteId: string
    avatar?: string
    name: string
}

export type LocalAuthProfileData = {
    provider: "password" | "code"
    email: string
}

export type GoogleAuthProfileData = {
    provider: "google"
    email: string
    emailVerified: boolean
    remoteId: string
    avatar?: string
    firstName: string
    lastName: string
}

export type ProfileData =
    | Prettify<LocalAuthProfileData>
    | Prettify<OAuthProfileData>
    | Prettify<GoogleAuthProfileData>

export function isOAuth2ProfileData(
    data: ProfileData
): data is OAuthProfileData {
    return (oauthProviders as ReadonlyArray<string>).includes(data.provider)
}
