import type { UserProperties } from "@karr/auth/subjects"
import logger from "@karr/logger"
import { err, type Result } from "neverthrow"
import type { ProfileData } from "../profile-fetchers"
import { findOrCreateUserFromGithub } from "./github"
import { findOrCreateUserFromGoogle } from "./google"
import { findOrCreateUserFromLocalAuth } from "./local"

/**
 * Checks if a user exists in the database based on the provided profile data.
 * If the user does not exist, it creates a new user and returns the user properties.
 * @param data The profile data to check or insert
 * @returns The user properties if the user exists or was created, or an error message
 */
export function getOrInsertUser(
    data: ProfileData
): Promise<Result<UserProperties, string>> {
    logger.debug(data)

    if (data.provider === "password" || data.provider === "code") {
        return findOrCreateUserFromLocalAuth(data)
    } else if (data.provider === "github") {
        return findOrCreateUserFromGithub(data)
    } else if (data.provider === "google") {
        return findOrCreateUserFromGoogle(data)
    }

    // Should never happen
    logger.debug(`Unknown provider: ${data.provider}`)
    return Promise.resolve(err("Invalid provider"))
}
