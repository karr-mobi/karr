import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { c, logger } from "@karr/logger"
import { app } from "../../src/server"

type Route = {
    method: string
    path: string
}

/**
 * Extract API routes from the Hono app instance
 * @returns An array of route objects with method, path, and handler properties
 */
function extractRoutesFromApp() {
    const routes = [] as Route[]
    for (const route of app.routes) {
        if (
            !route.path.endsWith("*") &&
            !route.path.startsWith("/api/v1/auth") &&
            !routes.find(
                (r) => r.path === route.path && r.method === route.method
            )
        ) {
            routes.push({
                method: route.method,
                path: route.path
            })
        }
    }

    return routes
}

// Extract the routes
const routes = extractRoutesFromApp()

if (routes.length === 0) {
    logger.warn("No routes were extracted.")
    process.exit(1)
}

// Define the output directory and file path
const outputDir = path.resolve(process.cwd(), "dist")
const outputFile = path.join(outputDir, "routes.json")

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
}

// Write the routes to the JSON file
fs.writeFileSync(outputFile, JSON.stringify(routes, null, 2))

logger.success(
    `✅ Extracted ${c.bold(routes.length)} routes to ${c.bold(outputFile)}`
)
process.exit(0)
