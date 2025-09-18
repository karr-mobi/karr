//biome-ignore-all lint/style/noNonNullAssertion: it's a util file idc

import { readdir, rm } from "node:fs/promises"
import process from "node:process"
import { unpluginFixNodeBuiltins } from "@karr/build-plugins/node-builtins"
import { c, logger } from "@karr/logger"
import { tryCatch } from "@karr/util"
import { build } from "esbuild"
import { runtime as detectedRuntime, env } from "std-env"

const runtime = env.TARGET_RUNTIME || detectedRuntime

const outdir = "out/db"

// list all files in the output directory and clear the output directory
const files = await readdir(outdir).catch(() => [])
await Promise.all(
    files.map((file) =>
        /\.(m?js|(d\.)?ts)$/.test(file) // match .js, .mjs, .d.ts, .d.ts
            ? rm(`${outdir}/${file}`, { recursive: true })
            : Promise.resolve()
    )
)

logger.info("Output directory cleared")

logger.info(
    `Bundling ${c.bold("migration script")} with esbuild, using ${runtime}`
)

const start = Date.now()

const result = await tryCatch(
    build({
        entryPoints: ["src/db/migrate.ts"],
        bundle: true,
        minify: true,
        platform: "node",
        target: "esnext",
        format: "esm",
        outdir,
        metafile: true,
        external: ["node:*", "bun:*"],
        plugins: [unpluginFixNodeBuiltins.esbuild()],
        splitting: false,
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

// Calculate total bundle size in bytes
const bytes = Object.keys(result.value.metafile.outputs).reduce(
    (acc, name) => acc + result.value.metafile.outputs[name]?.bytes!,
    0
)

logger.debug(
    `Generated ${Object.keys(result.value.metafile.outputs).length} chunks`
)

logger.success(
    `⚡ Bundled API in ${duration}ms ${c.bold(
        `(${(bytes! / 1024).toFixed(2)} kB)`
    )}`
)
