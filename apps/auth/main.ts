import logger from "@util/logger.ts"

export function add(a: number, b: number): number {
    return a + b
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
    logger.log("Add 2 + 3 =", add(2, 3))
}
