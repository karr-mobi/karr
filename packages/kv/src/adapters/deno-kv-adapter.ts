/**
 * Configure OpenAuth to use Deno KV as a store.
 *
 * This enables you to use Deno's built-in KV store for session and token storage.
 *
 * ```ts
 * import { DenoKV } from "@openauthjs/openauth/storage/deno-kv"
 *
 * const storage = await DenoKV()
 *
 * export default issuer({
 *   storage,
 *   // ...
 * })
 * ```
 *
 * Optionally, you can specify a custom database path.
 *
 * ```ts
 * const storage = await DenoKV({
 *   path: "./my-kv-db"
 * })
 * ```
 *
 * @packageDocumentation
 */
import type { StorageAdapter } from "@openauthjs/openauth/storage/storage"

export async function DenoKV({
    path
}: {
    path?: string
} = {}): Promise<StorageAdapter> {
    // biome-ignore-start lint/correctness/noUndeclaredVariables: Deno is unknown in node
    // @ts-expect-error: Deno is unknown in node
    const kv = await Deno.openKv(path)
    // biome-ignore-end lint/correctness/noUndeclaredVariables: Deno is unknown in node

    return {
        async get(key: string[]) {
            const result = await kv.get(key)
            // biome-ignore lint/suspicious/noExplicitAny: yeah
            return result.value as any
        },

        // biome-ignore lint/suspicious/noExplicitAny: yeah
        async set(key: string[], value: any, expiry?: Date) {
            const options: { expireIn?: number } = {}

            if (expiry) {
                const now = Date.now()
                const expiryTime = expiry.getTime()
                options.expireIn = Math.max(0, expiryTime - now)
            }

            await kv.set(key, value, options)
        },

        async remove(key: string[]) {
            await kv.delete(key)
        },

        async *scan(prefix: string[]) {
            const iter = kv.list({ prefix })

            for await (const entry of iter) {
                yield [entry.key as string[], entry.value]
            }
        }
    }
}
