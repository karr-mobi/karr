import { unpluginFixNodeBuiltins } from "@karr/build-plugins/node-builtins"
import { defineConfig } from "tsdown"

export default defineConfig({
    entry: "./src/config.ts",
    format: ["esm"],
    dts: true,
    clean: false,
    outDir: "./dist",
    plugins: [unpluginFixNodeBuiltins.rolldown()]
})
