/**
 * Utility type that expands complex types (like intersections or mapped types)
 * into a simpler, more readable structure in tooltips and error messages.
 *
 * It helps improve developer experience by showing the final computed shape
 * of a type, making it easier to understand and debug. It doesn't change
 * the actual structure of the type, only how TypeScript displays it.
 *
 * @template T The type to prettify.
 *
 * @example
 * type A = { a: string };
 * type B = { b: number };
 * type C = A & B;
 *
 * // Without Prettify, hovering over 'myVar' might show 'C' or 'A & B'
 * declare const myVar: C;
 *
 * // With Prettify, hovering over 'myPrettyVar' will show '{ a: string; b: number }'
 * declare const myPrettyVar: Prettify<C>;
 */
export type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

/**
 * Convert a string or number to an integer
 * @param value - The value to convert
 * @returns The integer value or undefined if the value is not a number
 * @throws If the value is not a number
 */
export function toInt(value: number | string): number {
    if (typeof value === "number") {
        return Number.isInteger(value) ? value : Math.floor(value)
    }

    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed)) {
        throw new Error(
            `${value} is not a number \n \t\t\tHINT: likely an invalid environment variable`
        )
    }

    return parsed
}

/**
 * Creates a lazy-initialized and memoized value.
 *
 * This function takes a `getter` function which is responsible for producing the value.
 * It returns an object with a `value` property. The `getter` function is only
 * executed the *first time* the `value` property is accessed. Subsequent accesses
 * will return the cached result without re-executing the `getter`.
 *
 * This is useful for delaying expensive computations or initializations until
 * they are actually needed.
 *
 * @template T The type of the value to be lazily computed.
 * @param getter — A function `() => T` that computes and returns the value.
 *               This function will be called at most once.
 * @returns An object with a `value` property of type T. Accessing this property
 *          triggers the computation (if not already done) and returns the value.
 *
 * @example
 * let computationCount = 0;
 * const expensiveValue = lazy(() => {
 *   console.log("Performing expensive computation...");
 *   computationCount++;
 *   return { data: "some complex data" };
 * });
 *
 * console.log("Accessing value first time:");
 * const val1 = expensiveValue.value; // Logs "Performing expensive computation..."
 * console.log(val1);                 // Logs { data: "some complex data" }
 * console.log("Computation count:", computationCount); // Logs 1
 *
 * console.log("Accessing value second time:");
 * const val2 = expensiveValue.value; // Does *not* log anything
 * console.log(val2);                 // Logs { data: "some complex data" }
 * console.log("Computation count:", computationCount); // Still logs 1
 */
export function lazy<T>(getter: () => T): { value: T } {
    return {
        get value() {
            const value = getter()
            Object.defineProperty(this, "value", { value })
            return value
        }
    }
}

/**
 * Wraps a promise in a try/catch block and returns a Result object representing
 * either a successful value or an error.
 *
 * This utility function provides a more structured way to handle asynchronous operations
 * without using try/catch blocks throughout your codebase. It follows a pattern similar
 * to Rust's Result type, allowing for more predictable error handling.
 *
 * @template T - The type of the value returned by the promise on success
 * @template E - The type of the error object (defaults to Error)
 *
 * @param promise - The promise to wrap and execute
 *
 * @returns A Promise resolving to a discriminated union object with:
 *   - On success: `{ success: true, value: T, error: null }`
 *   - On failure: `{ success: false, value: null, error: E }`
 *
 * @example
 * // Success case
 * const successResult = await tryCatch(Promise.resolve('data'));
 * if (successResult.success) {
 *   console.log(successResult.value); // 'data'
 * }
 *
 * @example
 * // Error case
 * const errorResult = await tryCatch(Promise.reject(new Error('Failed')));
 * if (!errorResult.success) {
 *   console.error(errorResult.error.message); // 'Failed'
 * }
 *
 * @example
 * // Using with custom error type
 * interface ApiError { code: number; message: string }
 * const apiCall = tryCatch<UserData, ApiError>(fetchUserData());
 */
export async function tryCatch<T, E = Error>(
    promise: Promise<T>
): Promise<
    | {
          success: true
          value: T
          error: null
      }
    | {
          success: false
          value: null
          error: E
      }
> {
    try {
        const value = await promise
        return { success: true, value, error: null }
    } catch (error) {
        return { success: false, value: null, error: error as E }
    }
}

//biome-ignore lint/performance/noBarrelFile: this is a utility file
export { toCamelCase } from "@std/text"
