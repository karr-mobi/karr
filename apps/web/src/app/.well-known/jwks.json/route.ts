import { permanentRedirect } from "next/navigation"

export async function GET(_request: Request) {
    await permanentRedirect("/api/v1/auth/.well-known/jwks.json")
}
