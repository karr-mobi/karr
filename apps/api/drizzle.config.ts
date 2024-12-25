import { defineConfig } from "drizzle-kit"

import { DB_CONFIG } from "@karr/config"

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schemas/*.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: DB_CONFIG.connStr
    }
})
