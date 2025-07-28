import NextImage from "next/image"

// Pixel GIF code adapted from https://stackoverflow.com/a/33919020/266535
const keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

const triplet = (e1: number, e2: number, e3: number) =>
    keyStr.charAt(e1 >> 2) +
    keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
    keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
    keyStr.charAt(e3 & 63)

const rgbDataURL = (r: number, g: number, b: number) =>
    `data:image/gif;base64,R0lGODlhAQABAPAA${
        triplet(0, r, g) + triplet(b, 255, 255)
    }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`

/**
 ** A Next.js Image component wrapper with RGB placeholder support.
 *
 * This component wraps Next.js's Image component and provides a blur placeholder
 * generated from RGB color values. The placeholder is created as a base64-encoded
 * 1x1 pixel GIF with the specified color.
 *
 * @param src - The source URL of the image
 * @param alt - Alternative text for the image for accessibility
 * @param width - The width of the image in pixels
 * @param height - The height of the image in pixels
 * @param placeholder - RGB color values as a tuple [r, g, b] for the blur placeholder
 * @returns A Next.js Image component with blur placeholder
 */
export function Image({
    src,
    alt,
    width,
    height,
    placeholder,
    className
}: {
    src: string
    alt: string
    width: number
    height: number
    placeholder: [number, number, number]
    className?: string
}) {
    return (
        <NextImage
            alt={alt}
            src={src}
            placeholder="blur"
            blurDataURL={rgbDataURL(...placeholder)}
            width={width}
            height={height}
            className={className}
        />
    )
}
