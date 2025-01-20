/** @typedef  {import("prettier").Config} PrettierConfig */

import module from 'module'
const require = module.createRequire(import.meta.url)

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
    arrowParens: "always",
    printWidth: 90,
    singleQuote: false,
    semi: false,
    trailingComma: "none",
    tabWidth: 4,
    plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"].map((plugin) => require.resolve(plugin)),
    tailwindStylesheet: "./packages/ui/src/styles/globals.css",
    tailwindFunctions: ["cn", "clsx"],
    // Last version that doesn't squash type and value imports
    importOrderTypeScriptVersion: "4.4.0",
    importOrder: [
        "^(react/(.*)$)|^(react$)",
        "^(next/(.*)$)|^(next$)",
        "<THIRD_PARTY_MODULES>",
        "",
        "^@karr/(.*)$",
        "^karr/(.*)$",
        "",
        "^@/(.*)$",
        "^[./]"
    ],
    proseWrap: "always" // printWidth line breaks in md/mdx
}

export default config
