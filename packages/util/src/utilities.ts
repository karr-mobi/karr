/**
 * Convert a snake_case string to camelCase
 * @param str - A string in snake_case
 * @returns The string in camelCase
 */
export function toCamelCase(str: string): string {
    // If the string is already in camelCase, return it as is
    if (/^[a-z][a-zA-Z0-9]*$/.test(str)) {
        return str
    }

    // Handle space/underscore separated and PascalCase strings
    return str
        .replace(/^[A-Z]/, (c) => c.toLowerCase()) // Convert first char to lowercase
        .replace(/[_\s](\w)/g, (_, c) => c.toUpperCase()) // Handle spaces and underscores
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
            `${value} is not a number \n \t\t\tHINT: likely an invalid environment variable`
        )
    }
    return parsed
}

/**
 * Check if a string is a valid UUID
 * @param str The string to check
 * @returns True if the string is a valid UUID, false otherwise
 */
export function isUUIDv4(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        str
    )
}
