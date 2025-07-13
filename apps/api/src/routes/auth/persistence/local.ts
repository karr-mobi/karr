import type { UserProperties } from "@karr/auth/subjects"
import logger from "@karr/logger"
import { and, eq } from "drizzle-orm"
import { err, ok } from "neverthrow"
import db from "@/db"
import { accountsTable } from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import type { LocalAuthProfileData } from "../profile-fetchers"
import { initUser } from "./initUser"

export async function findOrCreateUserFromLocalAuth(
    data: LocalAuthProfileData
) {
    // Check if user exists
    const user = await db
        .select()
        .from(accountsTable)
        .where(
            and(
                eq(accountsTable.provider, data.provider),
                eq(accountsTable.email, data.email)
            )
        )
        .innerJoin(profileTable, eq(accountsTable.profile, profileTable.id))

    if (user.length > 0 && user[0]) {
        // The user exists

        if (user[0].Accounts.blocked) {
            return err("Account is blocked")
        }

        return ok({
            id: user[0].Profile.id,
            firstName: user[0].Profile.firstName,
            lastName: user[0].Profile.lastName,
            nickname: user[0].Profile.nickname,
            avatar: user[0].Profile.avatar,
            role: user[0].Accounts.role
        } satisfies UserProperties)
    } else if (user.length === 0) {
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

        return ok(newUser.value satisfies UserProperties)
    }

    return err("Unknown error")
}
