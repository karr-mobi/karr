"use client"

import { Button } from "@karr/ui/components/button"
import { Input } from "@karr/ui/components/input"
import { toast } from "@karr/ui/components/sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CheckIcon, PencilIcon, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { client } from "@/util/apifetch"

interface DisplayNameProps {
    firstName: string | null
    lastName: string | null
    nickname: string | null
}

export default function DisplayName({
    firstName,
    lastName,
    nickname
}: DisplayNameProps) {
    const t = useTranslations("Account")
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(nickname || "")

    const displayName =
        nickname || `${firstName || ""} ${lastName || ""}`.trim()

    const mutation = useMutation({
        mutationFn: async (newNickname: string) => {
            const res = await client.user.nickname.$put({
                json: { nickname: newNickname || null }
            })
            if (res.status !== 200) {
                throw new Error("Failed to update nickname")
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] })
            setIsEditing(false)
            toast.success(t("nickname.update-success"))
        },
        onError: (error) => {
            console.error("Error updating nickname:", error)
            toast.error(t("nickname.update-failure"))
        }
    })

    const handleSave = () => {
        mutation.mutate(editValue)
    }

    const handleCancel = () => {
        setEditValue(nickname || "")
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder={t("nickname.enter")}
                    className="h-8 w-48"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSave()
                        } else if (e.key === "Escape") {
                            handleCancel()
                        }
                    }}
                    autoFocus
                />
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleSave}
                    disabled={mutation.isPending}
                >
                    <CheckIcon className="h-4 w-4" />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleCancel}
                    disabled={mutation.isPending}
                >
                    <XIcon className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <h3 className="!font-normal !font-sans text-lg">{displayName}</h3>
            <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setIsEditing(true)}
            >
                <PencilIcon className="h-4 w-4" />
            </Button>
        </div>
    )
}
