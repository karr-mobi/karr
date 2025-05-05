import { eq } from "drizzle-orm"

import db from "@karr/db"
import { userPrefsTable } from "@karr/db/schemas/userprefs.js"
import { profileTable } from "@karr/db/schemas/profile.js"
import logger from "@karr/logger"

const initUsersTable = async () => {
    // check if test user already exists
    const existingUser = await db
        .select()
        .from(profileTable)
        .where(eq(profileTable.firstName, "Test"))
    if (existingUser.length > 0) {
        logger.info("Test user already exists", { id: existingUser[0]?.id })
        process.exit(0)
    }

    // create a test user in the userprefs table
    const prefs = await db.insert(userPrefsTable).values({}).returning({
        insertedId: userPrefsTable.id
    })

    // create a test user in the users table
    const user = await db
        .insert(profileTable)
        .values({
            firstName: "Test",
            lastName: "User",
            prefs: prefs[0]!.insertedId
        })
        .returning({ insertedId: profileTable.id })

    // create a test user in the accounts table

    logger.info("Test user created", { id: user[0]?.insertedId })
}

initUsersTable()
