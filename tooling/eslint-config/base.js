import js from "@eslint/js"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import eslintConfigPrettier from "eslint-config-prettier"
import turboPlugin from "eslint-plugin-turbo"
import jsoncParser from "jsonc-eslint-parser"
import tseslint from "typescript-eslint"

import packageJsonPlugin from "./plugins/package-json-plugin.js"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
    js.configs.recommended,
    eslintConfigPrettier,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser
        },
        rules: {
            "turbo/no-undeclared-env-vars": "warn",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_", // starts with underscore
                    varsIgnorePattern: "^_"
                }
            ]
        }
    },
    {
        plugins: {
            // Add only the turbo plugin here
            turbo: turboPlugin
        }
    },
    {
        // JSON-specific configuration
        files: ["**/package.json"],
        languageOptions: {
            parser: jsoncParser,
            // Important: Let's explicitly set the ECMAScript version for JSON files
            ecmaVersion: 2022
        },
        plugins: {
            "package-json": packageJsonPlugin
        },
        rules: {
            // Disable all TypeScript rules
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-unused-vars": "off",
            // Add any other TS rules you need to disable...
            // Make sure this comes AFTER the TypeScript config

            // Enable our custom rule
            "package-json/no-direct-dependency-versions": "error"
        }
    },
    {
        ignores: ["dist/**", "out/**"]
    }
]
