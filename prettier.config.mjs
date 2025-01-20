/** @typedef  {import("prettier").Config} PrettierConfig */

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
    arrowParens: "always",
    printWidth: 90,
    singleQuote: false,
    semi: false,
    trailingComma: "none",
    tabWidth: 4,
    plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
    tailwindStylesheet: "./packages/ui/src/styles/globals.css",
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
