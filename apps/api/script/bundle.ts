//biome-ignore-all lint/style/noNonNullAssertion: it's a util file idc

import process from "node:process"
import { c, logger } from "@karr/logger"
import { tryCatch } from "@karr/util"
import { build } from "esbuild"
import { runtime } from "std-env"
//@ts-expect-error we need to use a .ts here for it to be imported by node without compilation
import { esbuildPlugin as fixNodeBuiltins } from "./unplugin-fix-node-builtins.ts"

logger.info("Bundling API...")

const start = Date.now()

const result = await tryCatch(
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
        outExtension: { ".js": ".mjs" },
        conditions: [runtime]
    })
)

if (!result.success) {
    logger.error("Build failed:", result.error)
    process.exit(1)
}

const end = Date.now()
const duration = end - start
const bytes = Object.keys(result.value.metafile.outputs)
    .map((name) => result.value.metafile.outputs[name]?.bytes)
    .reduce((acc, size) => acc! + size!, 0)

logger.debug(
    `Generated ${Object.keys(result.value.metafile.outputs).length} chunks`
)

logger.success(
    `⚡ Bundled API in ${duration}ms ${c.bold(
        `(${(bytes! / 1024).toFixed(2)} kB)`
    )}`
)
