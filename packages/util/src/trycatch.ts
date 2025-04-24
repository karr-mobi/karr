/**
 * Wraps a promise in a try/catch block and returns a Result object
 * @param promise The promise to wrap
 * @returns A Result object
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
