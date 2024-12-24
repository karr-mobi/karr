/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    transpilePackages: ["@karr/ui"],
    outputFileTracingIncludes: {
        "/**/*.css": ["src/assets/**/*.css"]
    }
}

export default nextConfig
