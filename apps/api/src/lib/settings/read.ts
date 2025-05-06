import { desc } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"

import drizzle from "@/db"
import { settingsTable } from "@/db/schemas/settings"

const settingsSelectSchema = createSelectSchema(settingsTable)

export async function readConfig() {
    const rows = await drizzle
        .select()
        .from(settingsTable)
        .orderBy(desc(settingsTable.inserted_at))
        .limit(1)
    return settingsSelectSchema.parse(rows[0])
}
