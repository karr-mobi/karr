import { API_BASE } from "@karr/config"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

console.log("API_BASE", API_BASE)

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
        //biome-ignore lint/style/useNamingConvention: it's an environment variable
        NEXT_PUBLIC_API_BASE: API_BASE
    },

    images: {
        remotePatterns: [
            new URL("https://profiles.cache.lol/finxol/picture?v=1743626159"),
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "/u/*"
            },
            {
                protocol: "https",
                hostname: "*.googleusercontent.com",
                port: "",
                pathname: "/a/**"
            },
            {
                protocol: "https",
                hostname: "misc.finxol.io",
                port: "",
                pathname: "/*"
            }
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
