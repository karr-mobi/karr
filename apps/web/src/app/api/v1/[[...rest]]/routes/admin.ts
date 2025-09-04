import { and, count, desc, eq } from "drizzle-orm"
import { z } from "zod/mini"
import db from "@/db"
import { accountsTable } from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import { base } from "../server"

const UsersListSchema = z.array(
    z.object({
        id: z.uuidv4(),
        firstName: z.string(),
        lastName: z.string(),
        nickname: z.nullable(z.string()),
        avatar: z.nullable(z.string()),
        role: z.enum(["admin", "user"]),
        blocked: z.nullable(z.boolean()),
        provider: z.string(),
        remoteId: z.string(),
        createdAt: z.iso.datetime()
    })
)

export type TUsersList = z.infer<typeof UsersListSchema>

const adminBase = base.use(async ({ next, context, errors }) => {
    const [user] = await db
        .select()
        .from(accountsTable)
        .where(
            and(
                eq(accountsTable.provider, context.user.provider),
                eq(accountsTable.remoteId, context.user.remoteId)
            )
        )
        .limit(1)

    if (!user) {
        throw errors.FORBIDDEN({
            message: "You are not authorized to access this resource",
            data: {
                cause: "User not found"
            }
        })
    }

    if (user.role !== "admin") {
        throw errors.FORBIDDEN({
            message: "You are do not have permission to access this resource",
            data: {
                cause: "User is not admin"
            }
        })
    }
    return next()
})

const adminCheck = adminBase
    .handler(() => {
        return "ok"
    })
    .actionable()
    .callable()

const instanceInfo = adminBase
    .route({
        method: "GET"
    })
    .output(
        z.object({
            userCount: z.number().check(z.nonnegative()),
            timestamp: z.iso.datetime()
        })
    )
    .handler(async () => {
        const [userCount] = await db
            .select({ count: count() })
            .from(accountsTable)

        const [firstAccount] = await db
            .select()
            .from(accountsTable)
            .orderBy(accountsTable.createdAt)
            .limit(1)

        return {
            userCount: userCount?.count || 0,
            timestamp:
                firstAccount?.createdAt.toISOString() ||
                new Date().toISOString()
        }
    })
    .actionable()
    .callable()

const usersList = adminBase
    .route({
        method: "GET"
    })
    .output(UsersListSchema)
    .handler(async () => {
        const usersList = await db
            .select({
                id: profileTable.id,
                role: accountsTable.role,
                blocked: accountsTable.blocked,
                provider: accountsTable.provider,
                remoteId: accountsTable.remoteId,
                firstName: profileTable.firstName,
                lastName: profileTable.lastName,
                nickname: profileTable.nickname,
                avatar: profileTable.avatar,
                createdAt: accountsTable.createdAt
            })
            .from(accountsTable)
            .innerJoin(
                profileTable,
                and(
                    eq(accountsTable.provider, profileTable.accountProvider),
                    eq(accountsTable.remoteId, profileTable.accountRemoteId)
                )
            )
            .orderBy(desc(accountsTable.createdAt))

        // Format the response with proper name handling
        return usersList.map((user) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            nickname: user.nickname,
            avatar: user.avatar,
            role: user.role,
            blocked: user.blocked,
            provider: user.provider,
            remoteId: user.remoteId,
            createdAt: user.createdAt.toISOString()
        }))
    })
    .actionable()
    .callable()

const blockUser = base
    .route({
        method: "PUT"
    })
    .input(
        z.object({
            provider: z.string(),
            remoteId: z.string()
        })
    )
    .handler(async ({ context, input, errors }) => {
        // Prevent admin from blocking themselves
        if (
            context.user.provider === input.provider &&
            context.user.remoteId === input.remoteId
        ) {
            throw errors.BAD_REQUEST({ message: "Cannot block yourself" })
        }

        // Check if user exists and is not an admin
        const [targetUser] = await db
            .select({ role: accountsTable.role })
            .from(accountsTable)
            .where(
                and(
                    eq(accountsTable.provider, input.provider),
                    eq(accountsTable.remoteId, input.remoteId)
                )
            )
            .limit(1)

        if (!targetUser) {
            throw errors.NOT_FOUND({ message: "User not found" })
        }

        if (targetUser.role === "admin") {
            throw errors.BAD_REQUEST({ message: "Cannot block admin users" })
        }

        // Block the user
        await db
            .update(accountsTable)
            .set({ blocked: true })
            .where(
                and(
                    eq(accountsTable.provider, input.provider),
                    eq(accountsTable.remoteId, input.remoteId)
                )
            )

        return {
            success: true,
            message: "User blocked successfully"
        }
    })
    .actionable()
    .callable()

const unblockUser = base
    .route({
        method: "PUT"
    })
    .input(
        z.object({
            provider: z.string(),
            remoteId: z.string()
        })
    )
    .handler(async ({ input, errors }) => {
        // Check if user exists
        const [targetUser] = await db
            .select({ role: accountsTable.role })
            .from(accountsTable)
            .where(
                and(
                    eq(accountsTable.provider, input.provider),
                    eq(accountsTable.remoteId, input.remoteId)
                )
            )
            .limit(1)

        if (!targetUser) {
            throw errors.NOT_FOUND({ message: "User not found" })
        }

        // Unblock the user
        await db
            .update(accountsTable)
            .set({ blocked: false })
            .where(
                and(
                    eq(accountsTable.provider, input.provider),
                    eq(accountsTable.remoteId, input.remoteId)
                )
            )

        return {
            success: true,
            message: "User unblocked successfully"
        }
    })
    .actionable()
    .callable()

export const router = {
    check: adminCheck,
    instance: instanceInfo,
    users: usersList,
    blockUser: blockUser,
    unblockUser: unblockUser
}

export default router
