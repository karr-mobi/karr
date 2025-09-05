import { toast } from "@karr/ui/components/sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import type { Dispatch, SetStateAction } from "react"
import { orpc } from "@/lib/orpc"

export function useBlockMutations() {
    const queryClient = useQueryClient()

    const blockUserMutation = useMutation(
        orpc.admin.blockUser.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: orpc.admin.users.queryKey()
                })
                toast.success("User blocked successfully")
            },
            onError: (error) => {
                console.error("Failed to block user:", error)
                toast.error("Failed to block user")
            }
        })
    )

    const unblockUserMutation = useMutation(
        orpc.admin.unblockUser.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: orpc.admin.users.queryKey()
                })
                toast.success("User unblocked successfully")
            },
            onError: (error) => {
                console.error("Failed to unblock user:", error)
                toast.error("Failed to unblock user")
            }
        })
    )

    return { blockUserMutation, unblockUserMutation }
}

export function useVerifyMutation() {
    const queryClient = useQueryClient()
    const t = useTranslations("Admin")

    return useMutation(
        orpc.admin.verifyUser.mutationOptions({
            onSuccess: () => {
                return queryClient.invalidateQueries({
                    queryKey: orpc.admin.users.queryKey()
                })
            },
            onError: (error, _ef, _context) => {
                console.error("Failed to verify user:", error)
                toast.error(t("verify-failed"))
            }
        })
    )
}

export function useRoleMutation(
    setRole: Dispatch<SetStateAction<"user" | "admin">>
) {
    const queryClient = useQueryClient()
    const t = useTranslations("Admin")

    return useMutation(
        orpc.admin.changeRole.mutationOptions({
            onMutate: (newRole) => {
                setRole(newRole.role)
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: orpc.admin.users.queryKey()
                })
            },
            onError: (error, _ef, _context) => {
                console.error("Failed to change role:", error)
                toast.error(t("role-change-failed"))
            }
        })
    )
}
