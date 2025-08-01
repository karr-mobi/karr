import type { GithubUserSubject } from "@karr/auth/subjects"
import logger from "@karr/logger"
import { and, eq } from "drizzle-orm"
import { err, ok } from "neverthrow"
import db from "@/db"
import { accountsTable } from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import { initUser, isTrustedProvider } from "./initUser"

export async function findOrCreateUserFromGithub(data: GithubUserSubject) {
    // Check if user exists
    const [user] = await db
        .select()
        .from(accountsTable)
        .where(
            and(
                eq(accountsTable.provider, data.provider),
                eq(accountsTable.remoteId, data.remoteId)
            )
        )
        .innerJoin(
            profileTable,
            and(
                eq(accountsTable.provider, profileTable.accountProvider),
                eq(accountsTable.remoteId, profileTable.accountRemoteId)
            )
        )

    if (user) {
        // The user exists

        if (user.Accounts.blocked) {
            return err("Account is blocked")
        }

        // update the user avatar if it is different
        if (user.Profile.avatar !== data.avatar) {
            const [a] = await Promise.all([
                db
                    .update(profileTable)
                    .set({ avatar: data.avatar })
                    .where(eq(profileTable.id, user.Profile.id))
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
                    .where(
                        and(
                            eq(accountsTable.provider, user.Accounts.provider),
                            eq(accountsTable.remoteId, user.Accounts.remoteId)
                        )
                    )
            ])

            if (a.length === 0 || !a[0]) {
                logger.error("Failed to update avatar")
                return err("Failed to update avatar")
            }
        }

        return ok()
    } else {
        // the user does not exist

        // if user does not exist, create it
        const [firstName, ...lastName] = data.name.split(" ")
        const newUser = await initUser({
            firstName: firstName ?? "",
            lastName: lastName.join(" "),
            avatar: data.avatar,
            email: data.email,
            verified: data.emailVerified,
            provider: data.provider,
            remoteId: data.remoteId
        })

        if (newUser.isErr()) {
            logger.error("Failed to create user", newUser.error)
            return err("Failed to create user")
        }

        return ok()
    }
}
