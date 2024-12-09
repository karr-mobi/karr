import { assertEquals } from "@std/assert"
import { build } from "../src/server.ts"

Deno.test(async function buildTest() {
    const app = build()
    const response = await app.inject({
        method: "GET",
        url: "/versions",
    })

    assertEquals(response.statusCode, 200)
    assertEquals(response.json(), {
        bestVersion: "v1",
        availableVersions: ["v1"],
    })
})
