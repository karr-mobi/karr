/*eslint-disable @typescript-eslint/no-explicit-any*/

declare module "*.png" {
    const value: import("next/image").StaticImageData
    export default value
}

declare module "*.jpg" {
    const value: import("next/image").StaticImageData
    export default value
}

declare module "*.jpeg" {
    const value: import("next/image").StaticImageData
    export default value
}

declare module "*.gif" {
    const value: import("next/image").StaticImageData
    export default value
}

declare module "*.webp" {
    const value: import("next/image").StaticImageData
    export default value
}

declare module "*.svg" {
    /**
     * Use `any` to avoid conflicts with `@svgr/webpack`.
     * Feel free to change this configuration to fit your needs.
     */
    // biome-ignore lint/suspicious/noExplicitAny: I don't know how it can be narrowed
    const value: any // Or use `import('next/image').StaticImageData` if you only use SVGs with next/image
    export default value
}
