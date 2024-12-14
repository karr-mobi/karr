export { default as logger } from "./logger.ts"

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

/**
 * Convert a string or number to an integer
 * @param value - The value to convert
 * @returns The integer value or undefined if the value is not a number
 * @throws If the value is not a number
 */
export function toInt(value: number | string): number {
    if (typeof value === "number") {
        return value
    }
    const parsed = parseInt(value, 10)
    if (isNaN(parsed)) {
        throw new Error(
            `${value} is not a number \n \t\t\tHINT: likely an invalid environment variable`,
        )
    }
    return parsed
}
