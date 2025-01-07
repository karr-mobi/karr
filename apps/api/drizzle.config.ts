import { defineConfig } from "drizzle-kit"

import getAppConfig from "@karr/config"

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schemas/*.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: getAppConfig().DB_CONFIG.connStr
    }
})
