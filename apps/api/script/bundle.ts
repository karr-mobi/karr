//biome-ignore-all lint/style/noNonNullAssertion: it's a util file

import process from "node:process"
import { c, logger } from "@karr/logger"
import { build } from "esbuild"
import { esbuildPlugin as fixNodeBuiltins } from "./unplugin-fix-node-builtins.ts"

logger.info("Bundling API...")

const start = Date.now()

build({
    entryPoints: ["src/main.ts"],
    bundle: true,
    minify: true,
    platform: "node",
    target: "esnext",
    format: "esm",
    outdir: "out",
    metafile: true,
    external: ["node:*", "bun:*"],
    plugins: [fixNodeBuiltins()],
    splitting: true,
    outExtension: { ".js": ".mjs" }
})
    .catch((err) => {
        logger.error("Build failed:", err)
        process.exit(1)
    })
    .then((result) => {
        const end = Date.now()
        const duration = end - start
        const bytes = Object.keys(result.metafile.outputs)
            .map((name) => result.metafile.outputs[name]?.bytes)
            .reduce((acc, size) => acc! + size!, 0)

        logger.debug(
            `Generated ${Object.keys(result.metafile.outputs).length} chunks`
        )

        logger.success(
            `⚡ Bundled API in ${duration}ms ${c.bold(
                `(${(bytes! / 1024).toFixed(2)} kB)`
            )}`
        )
    })
