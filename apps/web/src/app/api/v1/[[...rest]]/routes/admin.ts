import logger from "@karr/logger"
import { tryCatch } from "@karr/util"
import { and, count, desc, eq } from "drizzle-orm"
import { z } from "zod/mini"
import db from "@/db"
import {
    AccountIdSchema,
    accountsSelectSchema,
    accountsTable
} from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import { base as basicBase } from "../server"

const UsersListSchema = z.array(
    z.object({
        id: z.uuidv4(),
        firstName: z.string(),
        lastName: z.string(),
        nickname: z.nullable(z.string()),
        email: z.email(),
        avatar: z.nullable(z.string()),
        role: z.enum(["admin", "user"]),
        blocked: z.nullable(z.boolean()),
        verified: z.nullable(z.boolean()),
        provider: z.string(),
        remoteId: z.string(),
        createdAt: z.iso.datetime()
    })
)

export type TUsersList = z.infer<typeof UsersListSchema>

const base = basicBase.use(async ({ next, context, errors }) => {
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

const adminCheck = base
    .handler(() => {
        return "ok"
    })
    .actionable()
    .callable()

const instanceInfo = base
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

const usersList = base
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
                verified: accountsTable.verified,
                provider: accountsTable.provider,
                remoteId: accountsTable.remoteId,
                email: accountsTable.email,
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
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            blocked: user.blocked,
            verified: user.verified,
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
    .input(AccountIdSchema)
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
    .input(AccountIdSchema)
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

const verifyUser = base
    .route({
        method: "PUT"
    })
    .input(AccountIdSchema)
    .handler(async ({ input, errors }) => {
        // Verify the user
        const res = await tryCatch(
            db
                .update(accountsTable)
                .set({ verified: true })
                .where(
                    and(
                        eq(accountsTable.provider, input.provider),
                        eq(accountsTable.remoteId, input.remoteId)
                    )
                )
                .returning({
                    id: accountsTable.remoteId
                })
        )

        // Unknown error
        if (!res.success) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to verify user"
            })
        }

        // User not found
        if (res.value.length === 0) {
            throw errors.NOT_FOUND({
                message: "User not found"
            })
        }

        // Too many users found
        if (res.value.length > 1) {
            logger.error("Too many users verified", { input })
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Too many users verified"
            })
        }
    })
    .actionable()
    .callable()

const changeRole = base
    .route({ method: "PUT" })
    .input(
        AccountIdSchema.extend({
            role: accountsSelectSchema.shape.role
        })
    )
    .handler(async ({ input, errors }) => {
        const res = await tryCatch(
            db
                .update(accountsTable)
                .set({ role: input.role })
                .where(
                    and(
                        eq(accountsTable.provider, input.provider),
                        eq(accountsTable.remoteId, input.remoteId)
                    )
                )
                .returning({ role: accountsTable.role })
        )

        // Unknown error
        if (!res.success) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to verify user"
            })
        }

        // User not found
        if (res.value.length === 0) {
            throw errors.NOT_FOUND({
                message: "User not found"
            })
        }

        // Too many users found
        if (res.value.length > 1) {
            logger.error("Too many users role changed", { input })
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Too many users verified"
            })
        }
    })
    .actionable()
    .callable()

export const router = {
    check: adminCheck,
    instance: instanceInfo,
    users: usersList,
    blockUser: blockUser,
    unblockUser: unblockUser,
    verifyUser,
    changeRole
}

export default router
