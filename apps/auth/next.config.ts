import type { NextConfig } from "next"
//deno-lint-ignore no-external-import
import path from "node:path"

const nextConfig: NextConfig = {
    transpilePackages: ["@config", "@util", "@ui/components", "@ui/globals"],
    webpack: (config, { isServer: _isServer }) => {
        // Add workspace packages to watchOptions
        config.watchOptions = {
            ...config.watchOptions,
            ignored: ["**/node_modules/**", "!**/packages/**"],
        }

        // Add additional resolve paths for workspace packages
        config.resolve.modules.push(
            path.resolve("./packages/config/src"),
            path.resolve("./packages/util/src"),
            path.resolve("./packages/ui/src"),
        )

        return config
    },
}

export default nextConfig
