import createNextIntlPlugin from "next-intl/plugin"

import { API_BASE } from "@karr/config"

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    output: "standalone",
    /** Enables hot reloading for local packages without a build step */
    transpilePackages: ["@karr/ui", "@karr/config"],
    outputFileTracingIncludes: {
        "/**/*.css": ["src/assets/**/*.css"]
    },
    env: {
        NEXT_PUBLIC_API_BASE: API_BASE
    },

    images: {
        remotePatterns: [
            new URL("https://example.com/*"),
            new URL("https://profiles.cache.lol/finxol/picture?v=1743626159")
        ]
    },

    experimental: {
        reactCompiler: true,
        authInterrupts: true
    },

    /** We already do linting and typechecking as separate tasks in CI */
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true }
}

export default withNextIntl(nextConfig)
