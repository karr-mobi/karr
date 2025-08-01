import type { Result } from "neverthrow"
import type { createStorage } from "unstorage"

export type KvEntry = {
    //biome-ignore lint/suspicious/noExplicitAny: needed
    value: Record<string, any> | undefined
    expiry?: number
}

export type RawStore = ReturnType<typeof createStorage<KvEntry>>

export type Store = Result<RawStore, Error | unknown>
