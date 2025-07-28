import type { MetadataRoute } from "next"
import { headers } from "next/headers"
import "server-only"

import { APPLICATION_NAME } from "@karr/config"
import { APPLICATION_NAME as DEFAULT_APPLICATION_NAME } from "@karr/config/static"

export default function manifest(): MetadataRoute.Manifest {
    const _h = headers()

    return {
        name: APPLICATION_NAME,
        short_name: DEFAULT_APPLICATION_NAME,
        description: "Federated carpool platform",
        start_url: "/",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#fff",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon"
            }
        ]
    }
}
