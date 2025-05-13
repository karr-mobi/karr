import js from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import { configs as pnpmConfigs } from "eslint-plugin-pnpm" // Import the predefined configs
import turboPlugin from "eslint-plugin-turbo"
import tseslint from "typescript-eslint"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser
        },
        rules: {
            "turbo/no-undeclared-env-vars": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
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
        ignores: ["**/node_modules/**", "**/dist/**", "**/out/**"]
    },
    ...pnpmConfigs.json,
    ...pnpmConfigs.yaml
]
