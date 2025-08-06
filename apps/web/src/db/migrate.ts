import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import logger from "@karr/logger"
import type { MigrationConfig } from "drizzle-orm/migrator"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import db from "@/db"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
    const migrationsFolder = path.join(__dirname, "..", "..", "migrations")

    logger.debug(`dirname: ${__dirname}`)
    logger.debug(`Migrations folder: ${migrationsFolder}`)

    await migrate(db, { migrationsFolder } satisfies MigrationConfig)

    logger.success("Database migrations completed successfully")
    process.exit(0)
}

main().catch((error) => {
    if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "42P07"
    ) {
        // Tables already exist, this is fine
        logger.info("Tables already up to date, skipping migrations")
        process.exit(0)
    }
    console.error("Error running migrations:", error)
    process.exit(1)
})
