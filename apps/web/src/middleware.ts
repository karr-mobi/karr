import type { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

import { routing } from "./i18n/routing"

const i18nMiddleware = createMiddleware(routing)

export function middleware(request: NextRequest) {
    return i18nMiddleware(request)
}

export const config = {
    matcher: ["/trips/:path*", "/account", "/", "/(fr|en)/:path*"]
}
