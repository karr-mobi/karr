import { createStorage, type Driver } from "unstorage"
import type { KvEntry, RawStore } from "./types"

export function createStore({ driver }: { driver: Driver }): RawStore {
    return createStorage<KvEntry>({
        driver: driver
    })
}
