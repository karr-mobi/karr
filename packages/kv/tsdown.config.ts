import { unpluginFixNodeBuiltins } from "@karr/build-plugins/node-builtins"
import { defineConfig } from "tsdown"

export default defineConfig({
    entry: "./src/adapters/*.ts",
    format: ["esm"],
    dts: true,
    clean: true,
    outDir: "./dist",
    plugins: [unpluginFixNodeBuiltins.rolldown()]
})
