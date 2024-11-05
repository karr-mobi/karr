import { defineConfig } from "drizzle-kit"
import { DB_CONFIG } from "./src/util/config.ts"

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/*.sql.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: DB_CONFIG.connStr,
    },
})
