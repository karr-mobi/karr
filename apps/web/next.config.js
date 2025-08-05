import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    output: "standalone",
    /** Enables hot reloading for local packages without a build step */
    transpilePackages: ["@karr/ui"],
    outputFileTracingIncludes: {
        "/**/*.css": ["src/assets/**/*.css"]
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
