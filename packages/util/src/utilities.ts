import logger from "./logger.ts"

export { logger }

/**
 * Convert a snake_case string to camelCase
 * @param str - A string in snake_case
 * @returns The string in camelCase
 */
export function toCamelCase(str: string): string {
    return str.toLowerCase().replace(
        /(_\w)/g,
        (match) => match[1].toUpperCase(),
    )
}
