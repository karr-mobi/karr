import { count, desc, eq } from "drizzle-orm"
import { z } from "zod/v4-mini"
import db from "@/db"
import { accountsTable } from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import { base } from "../server"

const UsersListSchema = z.array(
    z.object({
        id: z.uuidv4(),
        profileId: z.uuidv4(),
        firstName: z.string(),
        lastName: z.string(),
        nickname: z.nullable(z.string()),
        avatar: z.nullable(z.string()),
        role: z.enum(["admin", "user"]),
        blocked: z.nullable(z.boolean()),
        provider: z.string(),
        createdAt: z.iso.datetime()
    })
)

export type TUsersList = z.infer<typeof UsersListSchema>

const adminBase = base.use(({ next, context, errors }) => {
    if (context.user.role !== "admin") {
        throw errors.FORBIDDEN({
            message: "You are do not have permission to access this resource",
            data: {
                cause: "You must be an admin"
            }
        })
    }
    return next()
})

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

        return {
            userCount: userCount?.count || 0,
            timestamp: new Date().toISOString()
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
                id: accountsTable.id,
                profileId: profileTable.id,
                role: accountsTable.role,
                blocked: accountsTable.blocked,
                provider: accountsTable.provider,
                firstName: profileTable.firstName,
                lastName: profileTable.lastName,
                nickname: profileTable.nickname,
                avatar: profileTable.avatar,
                createdAt: accountsTable.createdAt
            })
            .from(accountsTable)
            .innerJoin(profileTable, eq(accountsTable.profile, profileTable.id))
            .orderBy(desc(accountsTable.createdAt))

        // Format the response with proper name handling
        return usersList.map((user) => ({
            id: user.id,
            profileId: user.profileId,
            firstName: user.firstName,
            lastName: user.lastName,
            nickname: user.nickname,
            avatar: user.avatar,
            role: user.role,
            blocked: user.blocked,
            provider: user.provider,
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
            id: z.uuidv4()
        })
    )
    .handler(async ({ context, input, errors }) => {
        // Prevent admin from blocking themselves
        if (context.user.id === input.id) {
            throw errors.BAD_REQUEST({ message: "Cannot block yourself" })
        }

        // Check if user exists and is not an admin
        const [targetUser] = await db
            .select({ role: accountsTable.role })
            .from(accountsTable)
            .where(eq(accountsTable.id, input.id))
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
            .where(eq(accountsTable.id, input.id))

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
            id: z.uuidv4()
        })
    )
    .handler(async ({ input, errors }) => {
        // Check if user exists
        const [targetUser] = await db
            .select({ id: accountsTable.id })
            .from(accountsTable)
            .where(eq(accountsTable.id, input.id))
            .limit(1)

        if (!targetUser) {
            throw errors.NOT_FOUND({ message: "User not found" })
        }

        // Unblock the user
        await db
            .update(accountsTable)
            .set({ blocked: false })
            .where(eq(accountsTable.id, input.id))

        return {
            success: true,
            message: "User unblocked successfully"
        }
    })
    .actionable()
    .callable()

export const router = {
    instance: instanceInfo,
    users: usersList,
    blockUser: blockUser,
    unblockUser: unblockUser
}

export default router
