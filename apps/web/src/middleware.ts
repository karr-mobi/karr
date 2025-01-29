import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

import { routing } from "./i18n/routing"

const i18nMiddleware = createMiddleware(routing)

export function middleware(request: NextRequest) {
    const response = i18nMiddleware(request)

    if (response && !response.ok) {
        // response not in the range 200-299 (usually a redirect)
        // no need to execute the auth middleware
        return response
    }

    return authMiddleware(request, response)
}

function authMiddleware(request: NextRequest, response: NextResponse) {
    const isAuthenticated = request.cookies.get("auth-token") !== undefined

    if (!isAuthenticated && request.nextUrl.pathname.startsWith("/trips")) {
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    return response
}

export const config = {
    matcher: ["/trips/:path*", "/account", "/", "/(fr|en)/:path*"]
}
