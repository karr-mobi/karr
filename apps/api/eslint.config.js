import { config } from "@karr/eslint-config/base"

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
    ...config,
    {
        ignores: ["out/**"]
    }
]

export default eslintConfig
