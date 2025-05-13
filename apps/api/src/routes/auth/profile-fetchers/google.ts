import { ok } from "neverthrow"
import type { GoogleSuccessValue } from "../sucess"
import type { GoogleAuthProfileData } from "./index"

/**
 * Fetches the Google user data from the provided authentication data.
 *
 * @param data The Google authentication data containing the user's profile information
 * @returns A Result containing the combined profile and email data
 */
export function getGoogleUserData(data: GoogleSuccessValue["id"]) {
    const profileData: GoogleAuthProfileData = {
        provider: "google",
        email: data.email,
        emailVerified: data.email_verified,
        remoteId: data.sub,
        avatar: data.picture,
        firstName: data.given_name ?? "",
        lastName: data.family_name ?? ""
    }

    return ok(profileData)
}
