import { isDefinedError } from "@orpc/client"
import { useQuery } from "@tanstack/react-query"
import { orpc } from "@/lib/orpc"

export function useAdmin(): boolean {
    const { isLoading, isError, error } = useQuery(
        orpc.admin.check.queryOptions({
            retry: 0
        })
    )

    if (isLoading) return false
    if (isError) {
        if (isDefinedError(error) && error.code === "FORBIDDEN") {
            return false
        }
        console.error(error)
        return false
    }

    return true
}
