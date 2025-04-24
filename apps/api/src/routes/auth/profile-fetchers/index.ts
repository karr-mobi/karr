import { Prettify } from "@karr/util"
import { oauthProviders, type OAuth2Provider } from "../providers"

export type OAuthProfileData = {
    provider: OAuth2Provider
    email: string
    remoteId: string
    avatar?: string
    name: string
}

export type ProfileData =
    | Prettify<OAuthProfileData>
    | {
          provider: "password" | "code"
          email: string
      }

export function isOAuth2ProfileData(
    data: ProfileData
): data is OAuthProfileData {
    return (oauthProviders as ReadonlyArray<string>).includes(data.provider)
}
