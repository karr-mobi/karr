"use client"

import { Button } from "@karr/ui/components/button"
import { toast } from "@karr/ui/components/sonner"
import { Textarea } from "@karr/ui/components/textarea"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CheckIcon, MessageSquareIcon, PencilIcon, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { orpc } from "@/lib/orpc"

interface BioEditProps {
    bio: string | null
}

const MAX_BIO_LENGTH = 248

export default function BioEdit({ bio }: BioEditProps) {
    const t = useTranslations("Account")
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(bio || "")

    const mutation = useMutation(
        orpc.user.updateBio.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: orpc.user.info.key()
                })
                setIsEditing(false)
                toast.success(t("bio.update-success"))
            },
            onError: (error) => {
                console.error("Error updating bio:", error)
                toast.error(t("bio.update-failure"), {
                    description: error.message
                })
            }
        })
    )

    const handleSave = () => {
        if (editValue.length > MAX_BIO_LENGTH) {
            toast.error(t("bio.too-long"))
            return
        }
        mutation.mutate(editValue)
    }

    const handleCancel = () => {
        setEditValue(bio || "")
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <div className="space-y-2">
                <div className="relative">
                    <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder={t("bio.placeholder")}
                        className="min-h-[80px] pr-20"
                        maxLength={MAX_BIO_LENGTH}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                handleCancel()
                            }
                        }}
                        autoFocus
                    />
                    <div className="absolute right-2 bottom-2 text-muted-foreground text-xs">
                        {editValue.length}/{MAX_BIO_LENGTH}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={mutation.isPending}
                    >
                        <CheckIcon className="mr-1 h-3 w-3" />
                        {t("bio.save")}
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={mutation.isPending}
                    >
                        <XIcon className="mr-1 h-3 w-3" />
                        {t("bio.cancel")}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-start justify-start gap-3">
            <MessageSquareIcon className="mt-2 h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
                {bio ? (
                    <span className="text-sm">{bio}</span>
                ) : (
                    <span className="text-muted-foreground text-sm italic">
                        {t("bio.empty")}
                    </span>
                )}
            </div>
            <Button
                size="icon"
                variant="ghost"
                className="-mt-1 h-8 w-8"
                onClick={() => setIsEditing(true)}
            >
                <PencilIcon className="h-4 w-4" />
            </Button>
        </div>
    )
}
