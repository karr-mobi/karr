//biome-ignore-all lint/style/noNonNullAssertion: it's a util file idc

import { readdir, rm } from "node:fs/promises"
import process from "node:process"
import { unpluginFixNodeBuiltins } from "@karr/build-plugins/node-builtins"
import { c, logger } from "@karr/logger"
import { tryCatch } from "@karr/util"
import { build } from "esbuild"
import { runtime as detectedRuntime, env } from "std-env"

const runtime = env.TARGET_RUNTIME || detectedRuntime

// list all files in the output directory and clear the output directory
const files = await readdir("out").catch((e) => {
    // ignore if the error is Error: ENOENT: no such file or directory, scandir 'out'
    if (e.code !== "ENOENT") throw e
    return []
})
await Promise.all(
    files.map((file) =>
        /\.(m?js|(d\.)?ts)$/.test(file) // match .js, .mjs, .d.ts, .d.ts
            ? rm(`out/${file}`, { recursive: true })
            : Promise.resolve()
    )
)

logger.info("Output directory cleared")

logger.info(`Bundling API with esbuild, using ${runtime}`)

const start = Date.now()

const result = await tryCatch(
    build({
        entryPoints: ["src/server.ts"],
        bundle: true,
        minify: false,
        platform: "node",
        target: "esnext",
        format: "esm",
        outdir: "out",
        metafile: true,
        external: ["node:*", "bun:*"],
        plugins: [unpluginFixNodeBuiltins.esbuild()],
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
