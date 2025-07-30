export async function register() {
    // biome-ignore lint/nursery/noProcessGlobal: can't import process here
    // biome-ignore lint/style/noProcessEnv: can't import process here
    if (process.env.NEXT_RUNTIME === "nodejs") {
        await import("./lib/orpc.server")
    }
}
