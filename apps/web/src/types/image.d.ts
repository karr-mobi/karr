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
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value: any // Or use `import('next/image').StaticImageData` if you only use SVGs with next/image
    export default value
}
