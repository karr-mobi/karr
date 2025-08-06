//biome-ignore-all lint/style/noNonNullAssertion: it's a util file idc

import * as fs from "node:fs/promises"
import * as path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import { unpluginFixNodeBuiltins } from "@karr/build-plugins/node-builtins"
import { c, logger } from "@karr/logger"
import { tryCatch } from "@karr/util"
import { rolldown } from "rolldown"
import { runtime as detectedRuntime, env } from "std-env"

logger.info("Bundling API with Rolldown (direct)...")

const runtime = env.TARGET_RUNTIME || detectedRuntime

// Get the directory of the current script to resolve paths correctly
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "..")

const start = Date.now()

logger.info(`Building with runtime ${runtime}`)

const result = await tryCatch(
    (async () => {
        const bundle = await rolldown({
            input: "src/server.ts",
            plugins: [unpluginFixNodeBuiltins.rolldown()],
            external: (id) => {
                // Only mark Node.js and Bun built-ins as external
                return id.startsWith("node:") || id.startsWith("bun:")
            },
            platform: "node",
            resolve: {
                // TypeScript path aliases from tsconfig
                alias: {
                    "@": path.resolve(projectRoot, "src")
                },
                // Put runtime condition first so it takes priority
                conditionNames: [
                    runtime,
                    "import",
                    "module",
                    "node",
                    "default"
                ],
                mainFields: ["module", "main"],
                extensions: [".ts", ".mjs", ".js", ".json", ".node"]
            },
            treeshake: {
                moduleSideEffects: "no-external"
            },
            // Ensure everything is bundled
            shimMissingExports: true
        })

        const { output } = await bundle.write({
            format: "esm",
            dir: "out",
            entryFileNames: "server.mjs",
            chunkFileNames: "[name]-[hash].mjs",
            minify: false,
            sourcemap: false,
            // Force everything into a single file
            inlineDynamicImports: true,
            preserveModules: false
        })

        await bundle.close()

        return output
    })()
)

if (!result.success) {
    logger.error("Build failed:", result.error)
    process.exit(1)
}

const end = Date.now()
const duration = end - start

// Calculate total size from output chunks
let bytes = 0
let chunkCount = 0

try {
    const outDir = "out"
    const files = await fs.readdir(outDir)
    const mjsFiles = files.filter((f) => f.endsWith(".mjs"))
    chunkCount = mjsFiles.length

    // Read all file sizes in parallel
    const sizes = await Promise.all(
        mjsFiles.map(async (file) => {
            const stats = await fs.stat(path.join(outDir, file))
            return stats.size
        })
    )

    bytes = sizes.reduce((acc, size) => acc + size, 0)
} catch (error) {
    logger.warn("Could not calculate bundle size:", error)
}

if (chunkCount > 0) {
    logger.debug(`Generated ${chunkCount} chunks`)
}

logger.success(
    `⚡ Bundled API with Rolldown in ${duration}ms ${
        bytes > 0 ? c.bold(`(${(bytes / 1024).toFixed(2)} kB)`) : ""
    }`
)
