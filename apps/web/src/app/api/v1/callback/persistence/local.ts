import type { LocalUserSubject } from "@karr/auth/subjects"
import logger from "@karr/logger"
import { and, eq } from "drizzle-orm"
import { err, ok } from "neverthrow"
import db from "@/db"
import { accountsTable } from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import { initUser } from "./initUser"

export async function findOrCreateUserFromLocalAuth(data: LocalUserSubject) {
    // Check if user exists
    const [user] = await db
        .select()
        .from(accountsTable)
        .where(
            and(
                eq(accountsTable.provider, data.provider),
                eq(accountsTable.email, data.email)
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

        return ok()
    } else {
        // the user does not exist

        // create it and return the new user data
        const name = data.email.split("@")[0]
        const newUser = await initUser({
            firstName: name ?? "",
            lastName: "",
            avatar: "https://misc.finxol.io/clemence.jpeg",
            email: data.email,
            provider: data.provider,
            remoteId: data.email
        })

        if (newUser.isErr()) {
            logger.error("Failed to create user", newUser.error)
            return err("Failed to create user")
        }

        return ok()
    }
}
