import { defineConfig } from "drizzle-kit"

export default defineConfig({
    out: "./migrations",
    schema: "./src/schemas/*.ts",
    dialect: "postgresql"
})
