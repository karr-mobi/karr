// @ts-check

import starlight from "@astrojs/starlight"
import deno from "@deno/astro-adapter"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import starlightSidebarTopics from "starlight-sidebar-topics"
import config from "./values"

// https://astro.build/config
export default defineConfig({
    output: "static",
    adapter: deno(),
    site: config.docsWebsite,

    redirects: {
        "/": `/${config.locales.defaultLocale}`
    },

    devToolbar: {
        enabled: false
    },

    integrations: [
        starlight({
            title: "Karr Docs",
            lastUpdated: true,
            ...config.locales,
            logo: {
                src: "./src/assets/logo_tmp.jpg"
            },
            social: [
                {
                    icon: "github",
                    label: "GitHub",
                    href: config.github
                }
            ],
            editLink: {
                baseUrl: `${config.github}/edit/main/apps/docs/`
            },
            pagination: false,
            plugins: [
                starlightSidebarTopics([
                    {
                        label: {
                            en: "Getting Started",
                            fr: "Prise en main"
                        },
                        icon: "rocket",
                        link: "/getting-started",
                        items: [
                            {
                                label: "Setup a new instance",
                                link: "/getting-started",
                                translations: {
                                    fr: "Guide d'Installation"
                                }
                            },
                            {
                                label: "Glossary",
                                link: "/glossary",
                                translations: {
                                    fr: "Glossaire"
                                }
                            },
                            {
                                label: "Configuration Reference",
                                link: "/getting-started/configuration-reference",
                                translations: {
                                    fr: "Référence de configuration"
                                }
                            }
                        ]
                    },
                    {
                        label: {
                            en: "Development",
                            fr: "Développement"
                        },
                        icon: "laptop",
                        link: "/development",
                        items: [
                            {
                                label: "Getting Started",
                                link: "/development",
                                translations: {
                                    fr: "Mise en route"
                                }
                            },
                            {
                                label: "Project Structure",
                                link: "/development/project-structure",
                                translations: {
                                    fr: "Structure du projet"
                                }
                            },
                            {
                                label: "Configuration",
                                link: "/development/configuration",
                                translations: {
                                    fr: "Configuration"
                                }
                            },
                            {
                                label: "Dependency Management",
                                link: "/development/dependencies",
                                translations: {
                                    fr: "Gestion des dépendances"
                                }
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
                                autogenerate: {
                                    directory: "development/packages"
                                }
                            },
                            {
                                label: "API reference",
                                translations: {
                                    fr: "Référence de l'API"
                                },
                                collapsed: true,
                                autogenerate: {
                                    directory: "development/api-reference"
                                }
                            }
                        ]
                    }
                ])
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
