import { accountsTable } from "./accounts.sql.ts"
import { usersTable } from "./users.sql.ts"
import { userPrefsTable } from "./userprefs.sql.ts"
import db from "../lib/db_conn.ts"
import { eq } from "drizzle-orm"
import { logger } from "@util"

const initUsersTable = async () => {
    // check if test user already exists
    const existingUser = await db.select().from(usersTable).where(
        eq(usersTable.firstName, "Test"),
    )
    if (existingUser.length > 0) {
        logger.info("Test user already exists", { id: existingUser[0].id })
        Deno.exit(0)
    }

    // create a test user in the userprefs table
    const prefs = await db.insert(userPrefsTable).values({}).returning({
        insertedId: userPrefsTable.id,
    })

    // create a test user in the users table
    const user = await db.insert(usersTable).values({
        firstName: "Test",
        lastName: "User",
        prefs: prefs[0].insertedId,
    }).returning({ insertedId: usersTable.id })

    // create a test user in the accounts table
    await db.insert(accountsTable).values({
        email: "test@example.org",
        user: user[0].insertedId,
    })

    logger.info("Test user created", { id: user[0].insertedId })
    Deno.exit(0)
}

initUsersTable()
