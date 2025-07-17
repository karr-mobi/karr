import { count, desc, eq } from "drizzle-orm"
import { Hono } from "hono"
import { db } from "@/db"
import { accountsTable } from "@/db/schemas/accounts"
import { profileTable } from "@/db/schemas/profile"
import type { AppVariables, ErrorResponse } from "@/lib/types.d.ts"
import { getUserSub } from "@/util/subject"

const hono = new Hono<{ Variables: AppVariables }>()

    // ==============================================
    // ========== Admin endpoint routes =============
    // ==============================================

    // Admin check middleware
    .use("/*", async (c, next) => {
        const subject = getUserSub(c)

        if (!subject) {
            return c.json(
                {
                    message: "User subject missing in context"
                } satisfies ErrorResponse,
                500
            )
        }

        if (subject.role !== "admin") {
            return c.json(
                {
                    message: "Forbidden: Admin access required"
                } satisfies ErrorResponse,
                403
            )
        }

        await next()
    })

    /**
     * Get instance information
     * @returns Object containing instance info
     */
    .get("/instance", async (c) => {
        const [userCount] = await db
            .select({ count: count() })
            .from(accountsTable)

        return c.json({
            userCount: userCount?.count || 0,
            timestamp: new Date().toISOString()
        })
    })

    /**
     * Get all users
     * @returns Array of user objects
     */
    .get("/users", async (c) => {
        const usersList = await db
            .select({
                id: profileTable.id,
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
        const formattedUsers = usersList.map((user) => ({
            id: user.id,
            name:
                user.nickname ||
                `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                null,
            avatar: user.avatar,
            role: user.role,
            blocked: user.blocked,
            provider: user.provider,
            createdAt: user.createdAt.toISOString()
        }))

        return c.json(formattedUsers)
    })

    /**
     * Block a user
     * @param id - User ID to block
     * @returns Success message
     */
    .post("/users/:id/block", async (c) => {
        const { id } = c.req.param()
        const subject = getUserSub(c)

        if (!id) {
            return c.json(
                {
                    message: "User ID is required"
                } satisfies ErrorResponse,
                400
            )
        }

        // Prevent admin from blocking themselves
        if (subject?.id === id) {
            return c.json(
                {
                    message: "Cannot block yourself"
                } satisfies ErrorResponse,
                400
            )
        }

        // Check if user exists and is not an admin
        const [targetUser] = await db
            .select({ role: accountsTable.role })
            .from(accountsTable)
            .where(eq(accountsTable.id, id))
            .limit(1)

        if (!targetUser) {
            return c.json(
                {
                    message: "User not found"
                } satisfies ErrorResponse,
                404
            )
        }

        if (targetUser.role === "admin") {
            return c.json(
                {
                    message: "Cannot block admin users"
                } satisfies ErrorResponse,
                400
            )
        }

        // Block the user
        await db
            .update(accountsTable)
            .set({ blocked: true })
            .where(eq(accountsTable.id, id))

        return c.json({
            success: true,
            message: "User blocked successfully"
        })
    })

    /**
     * Unblock a user
     * @param id - User ID to unblock
     * @returns Success message
     */
    .post("/users/:id/unblock", async (c) => {
        const { id } = c.req.param()

        if (!id) {
            return c.json(
                {
                    message: "User ID is required"
                } satisfies ErrorResponse,
                400
            )
        }

        // Check if user exists
        const [targetUser] = await db
            .select({ id: accountsTable.id })
            .from(accountsTable)
            .where(eq(accountsTable.id, id))
            .limit(1)

        if (!targetUser) {
            return c.json(
                {
                    message: "User not found"
                } satisfies ErrorResponse,
                404
            )
        }

        // Unblock the user
        await db
            .update(accountsTable)
            .set({ blocked: false })
            .where(eq(accountsTable.id, id))

        return c.json({
            success: true,
            message: "User unblocked successfully"
        })
    })

export default hono
