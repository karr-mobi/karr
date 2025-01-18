import crypto from "node:crypto"
import { and, eq } from "drizzle-orm"

import db from "@karr/db"
import { accountsTable } from "@karr/db/schemas/accounts.js"
import logger from "@karr/util/logger"

export async function authenticate(email: string, password: string) {
    const user = await db
        .select({
            id: accountsTable.id,
            email: accountsTable.email,
            password: accountsTable.password,
            blocked: accountsTable.blocked,
            verified: accountsTable.verified
        })
        .from(accountsTable)
        .where(eq(accountsTable.email, email))
        .limit(1)

    if (!user || user.length === 0 || user[0] === undefined) {
        throw new Error("Invalid email or password")
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")

    if (hashedPassword !== user[0].password) {
        throw new Error("Invalid email or password")
    }

    if (user[0].blocked) {
        throw new Error("Account is blocked")
    }

    return user[0]
}

export async function login(email: string, password: string) {
    const user = await authenticate(email, password)

    if (!user) {
        throw new Error("Invalid email or password")
    }

    // generate a new token
    const token = crypto.randomUUID()

    const saved = await db
        .update(accountsTable)
        .set({ token })
        .where(eq(accountsTable.id, user.id))
        .returning({ token: accountsTable.token })

    if (!saved || saved.length === 0 || saved[0] === undefined) {
        logger.error(`Failed to save token: ${token}`)
    }

    return token
}

export async function register(email: string, password: string): Promise<string> {
    const user = await db
        .insert(accountsTable)
        .values({
            email,
            password: crypto.createHash("sha256").update(password).digest("hex"),
            blocked: false,
            verified: true
        })
        .returning({ insertedId: accountsTable.id })

    if (user.length === 0 || user[0] === undefined) {
        throw new Error("An error occurred while creating the user")
    }

    // generate a new token
    const token = crypto.randomUUID()

    db.update(accountsTable)
        .set({ token })
        .where(eq(accountsTable.id, user[0].insertedId))

    return token
}

export async function isAuthenticated(userId: string, token: string) {
    const user = await db
        .select({
            id: accountsTable.id,
            email: accountsTable.email,
            blocked: accountsTable.blocked,
            verified: accountsTable.verified
        })
        .from(accountsTable)
        .where(and(eq(accountsTable.token, token), eq(accountsTable.id, userId)))
        .limit(1)

    if (!user || user.length === 0 || user[0] === undefined) {
        return false
    }

    if (user[0].id !== userId) {
        return false
    }

    return true
}

export async function logout(token: string) {
    db.update(accountsTable).set({ token: "" }).where(eq(accountsTable.token, token))
}

export async function getAccount(token: string): Promise<string | null> {
    const account = await db
        .select({
            id: accountsTable.id
        })
        .from(accountsTable)
        .where(eq(accountsTable.token, token))
        .limit(1)

    if (!account || account.length === 0 || account[0] === undefined) {
        return null
    }

    return account[0].id
}
