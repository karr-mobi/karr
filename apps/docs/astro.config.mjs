// @ts-check
import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import config from "./values"

import deno from "@deno/astro-adapter"

import tailwindcss from "@tailwindcss/vite"

// https://astro.build/config
export default defineConfig({
    output: "static",
    adapter: deno(),
    site: config.docsWebsite,

    devToolbar: {
        enabled: false
    },

    integrations: [
        starlight({
            title: "Karr Docs",
            logo: {
                src: "./src/assets/logo_tmp.jpg"
            },
            social: [
                {
                    icon: "github",
                    label: "GitHub",
                    href: config.docsGithub
                }
            ],
            editLink: {
                baseUrl: `${config.docsGithub}/edit/main/`
            },
            pagination: false,
            sidebar: [
                {
                    label: "Glossary",
                    link: "/glossary"
                },
                {
                    label: "Getting Started",
                    items: [
                        {
                            label: "Setup a new instance",
                            link: "/getting-started/setup"
                        },
                        {
                            label: "Configuration Reference",
                            link: "/getting-started/configuration-reference"
                        }
                    ]
                },
                {
                    label: "Development",
                    collapsed: true,
                    items: [
                        {
                            label: "Getting Started",
                            link: "/development/getting-started"
                        },
                        {
                            label: "Project Structure",
                            link: "/development/project-structure"
                        },
                        {
                            label: "Configuration",
                            link: "/development/configuration"
                        },
                        {
                            label: "Dependency Management",
                            link: "/development/dependencies"
                        },
                        {
                            label: "Web",
                            collapsed: true,
                            autogenerate: { directory: "development/web" }
                        },
                        {
                            label: "API",
                            collapsed: true,
                            autogenerate: { directory: "development/api" }
                        },
                        {
                            label: "Packages",
                            collapsed: false,
                            autogenerate: { directory: "development/packages" }
                        },
                        {
                            label: "API reference",
                            collapsed: true,
                            autogenerate: {
                                directory: "development/api-reference"
                            }
                        }
                    ]
                }
            ],
            customCss: [
                // Path to your Tailwind base styles:
                "./src/styles/global.css"
            ]
        })
    ],

    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                "@": "/src"
            }
        }
    }
})
