import type { UserProperties } from "@karr/auth/subjects"
import logger from "@karr/logger"
import { and, eq } from "drizzle-orm"
import { err, ok } from "neverthrow"
import db from "@/db"
import { accountsTable } from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import type { GoogleAuthProfileData } from "../profile-fetchers"
import { initUser, isTrustedProvider, type UserInitData } from "./initUser"

export async function findOrCreateUserFromGoogle(data: GoogleAuthProfileData) {
    // Check if user exists
    const user = await db
        .select()
        .from(accountsTable)
        .where(
            and(
                eq(accountsTable.provider, data.provider),
                eq(accountsTable.remoteId, data.remoteId)
            )
        )
        .innerJoin(profileTable, eq(accountsTable.profile, profileTable.id))

    if (user.length > 0 && user[0]) {
        // The user exists

        if (user[0].Accounts.blocked) {
            return err("Account is blocked")
        }

        // update the user avatar if it is different
        let avatar = data.avatar
        if (user[0].Profile.avatar !== data.avatar) {
            const [a] = await Promise.all([
                db
                    .update(profileTable)
                    .set({ avatar: data.avatar })
                    .where(eq(profileTable.id, user[0].Profile.id))
                    .returning({
                        avatar: profileTable.avatar
                    }),
                db
                    .update(accountsTable)
                    .set({
                        verified: isTrustedProvider(data.provider)
                            ? data.emailVerified
                            : false
                    })
                    .where(eq(accountsTable.id, user[0].Accounts.id))
            ])

            if (a.length === 0 || !a[0]) {
                logger.error("Failed to update avatar")
                return err("Failed to update avatar")
            }

            avatar = a[0].avatar ?? undefined
        }

        return ok({
            id: user[0].Profile.id,
            firstName: user[0].Profile.firstName,
            lastName: user[0].Profile.lastName,
            nickname: user[0].Profile.nickname,
            avatar: avatar,
            role: user[0].Accounts.role
        } satisfies UserProperties)
    }

    if (user.length === 0) {
        // the user does not exist

        // if user does not exist, create it and return the new user data
        const newUser = await initUser({
            firstName: data.firstName,
            lastName: data.lastName,
            avatar: data.avatar,
            email: data.email,
            verified: data.emailVerified,
            provider: data.provider,
            remoteId: data.remoteId
        } satisfies UserInitData)

        if (newUser.isErr()) {
            logger.error("Failed to create user", newUser.error)
            return err("Failed to create user")
        }

        return ok(newUser.value satisfies UserProperties)
    }

    return err("Unknown error")
}
