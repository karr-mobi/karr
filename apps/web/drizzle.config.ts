import { defineConfig } from "drizzle-kit"

export default defineConfig({
    out: "./migrations",
    schema: "./src/db/schemas/*.ts",
    dialect: "postgresql"
})
