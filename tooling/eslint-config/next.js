import pluginNext from "@next/eslint-plugin-next"
import pluginTanstackQuery from "@tanstack/eslint-plugin-query"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import globals from "globals"

import { config as baseConfig } from "./base.js"

import serverOnlyKarrConfig from "./plugins/server-only-karr-config.js"

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nextJsConfig = [
    ...baseConfig,
    {
        ignores: [
            ".next/**", // Ignore Next.js build directory
            "node_modules/**", // Ignore dependencies
            "dist/**" // Ignore common build output folders
            // Add any other folders/files you want to ignore globally
        ]
    },

    {
        ...pluginReact.configs.flat.recommended,
        languageOptions: {
            ...pluginReact.configs.flat.recommended.languageOptions,
            globals: {
                ...globals.serviceworker
            }
        },
        rules: {
            // using TypeScript for type checking instead of PropTypes
            "react/prop-types": "off"
        }
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "@next/next": pluginNext
        },
        rules: {
            ...pluginNext.configs.recommended.rules,
            ...pluginNext.configs["core-web-vitals"].rules,
            // Disable the rule since this is only a component library
            "@next/next/no-html-link-for-pages": "off"
        }
    },
    {
        plugins: {
            "react-hooks": pluginReactHooks
        },
        settings: { react: { version: "detect" } },
        rules: {
            ...pluginReactHooks.configs.recommended.rules,
            // React scope no longer necessary with new JSX transform.
            "react/react-in-jsx-scope": "off"
        }
    },
    {
        // Add TanStack Query plugin configuration
        plugins: {
            "@tanstack/query": pluginTanstackQuery
        },
        rules: {
            ...pluginTanstackQuery.configs.recommended.rules
        }
    },
    {
        // Target your source files
        files: ["src/**/*.{js,ts,jsx,tsx}"],
        // ADD the custom plugin registration HERE
        plugins: {
            "server-only-karr-config": serverOnlyKarrConfig
        },
        rules: {
            // ENABLE the custom rule HERE
            "server-only-karr-config/enforce-server-only-for-karr-config": "error",

            // Keep your existing no-restricted-imports rule
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        // Consistently import navigation APIs from `@/i18n/routing`
                        {
                            name: "next/link",
                            message: "Please import Link from `@/i18n/routing` instead."
                        },
                        {
                            name: "next/navigation",
                            importNames: [
                                "redirect",
                                "permanentRedirect",
                                "useRouter",
                                "usePathname"
                            ],
                            message: "Please import from `@/i18n/routing` instead."
                        }
                    ]
                }
            ]
        }
    }
]
