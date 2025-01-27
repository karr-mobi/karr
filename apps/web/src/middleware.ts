import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const isAuthenticated = request.cookies.get("auth-token") !== undefined

    if (!isAuthenticated && request.nextUrl.pathname.startsWith("/trips")) {
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/trips/:path*", "/account"]
}
