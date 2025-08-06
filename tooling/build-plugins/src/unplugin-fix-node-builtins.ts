import { createUnplugin } from "unplugin"

export interface Options {
    /** List of built-in modules to prefix with "node:" */
    builtins?: string[]
    /** Whether to automatically import Buffer when used (default: true) */
    autoImportBuffer?: boolean
}

const defaultBuiltins = [
    "assert",
    "async_context",
    "async_hooks",
    "buffer",
    "child_process",
    "cluster",
    "console",
    "constants",
    "crypto",
    "dgram",
    "diagnostics_channel",
    "dns",
    "domain",
    "events",
    "fs",
    "http",
    "http2",
    "https",
    "inspector",
    "intl",
    "module",
    "net",
    "os",
    "path",
    "perf_hooks",
    "process",
    "punycode",
    "querystring",
    "readline",
    "repl",
    "report",
    "stream",
    "string_decoder",
    "test",
    "timers",
    "tls",
    "trace_events",
    "tty",
    "url",
    "util",
    "v8",
    "vm",
    "wasi",
    "worker_threads",
    "zlib"
]

/**
 * Unplugin factory function to prefix built-in modules with "node:"
 * @param options Options for the plugin
 * @returns The plugin object
 */
export const unpluginFactory = (options: Options = {}) => {
    const builtins = Array.from(
        new Set(defaultBuiltins.concat(options.builtins || []))
    )
    const filter = new RegExp(`^(${builtins.join("|")})$`)
    const autoImportBuffer = options.autoImportBuffer !== false

    return {
        name: "fix-node-builtins",
        resolveId(id: string) {
            if (filter.test(id)) {
                return {
                    id: `node:${id}`,
                    external: true
                }
            }
        },
        transform(code: string, id: string) {
            // Skip if auto-import is disabled or file is not JS/TS
            if (!autoImportBuffer || !/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(id)) {
                return null
            }

            // Check if Buffer is used in the code
            const bufferUsageRegex =
                /\bBuffer\b(?!\s*:|.*from\s+['"](?:node:)?buffer['"])/g
            const hasBufferUsage = bufferUsageRegex.test(code)

            if (!hasBufferUsage) {
                return null
            }

            // Check if Buffer is already imported
            const importRegex =
                /(?:import|require)\s*(?:\{[^}]*\bBuffer\b[^}]*\}|.*)\s*from\s*['"](?:node:)?buffer['"]/
            const hasBufferImport = importRegex.test(code)

            if (hasBufferImport) {
                return null
            }

            // Add Buffer import at the beginning of the file
            const bufferImport = `import { Buffer } from 'node:buffer';\n`
            const transformedCode = bufferImport + code

            return {
                code: transformedCode,
                map: null // You might want to generate a proper source map here
            }
        }
    }
}

/**
 * Unplugin plugin to prefix built-in modules with "node:" and add Buffer import if needed
 * @param options Options for the plugin
 * @returns The plugin object
 */
export const unpluginFixNodeBuiltins = createUnplugin(unpluginFactory)
