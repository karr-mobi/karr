import { createUnplugin } from "unplugin"

export interface Options {
    /** List of built-in modules to prefix with "node:" */
    builtins?: string[]
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

    return {
        name: "fix-node-builtins",
        resolveId(id: string) {
            if (filter.test(id)) {
                return {
                    id: `node:${id}`,
                    external: true
                }
            }
        }
    }
}

/**
 * Unplugin plugin to prefix built-in modules with "node:"
 * @param options Options for the plugin
 * @returns The plugin object
 */
export const unpluginFixNodeBuiltins = createUnplugin(unpluginFactory)
