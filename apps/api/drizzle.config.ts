import { DB_CONFIG } from "@config"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/*.sql.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: DB_CONFIG.connStr
    }
})
