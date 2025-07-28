"use client"

import { Button } from "@karr/ui/components/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@karr/ui/components/dialog"
import { Input } from "@karr/ui/components/input"
import { Label } from "@karr/ui/components/label"
import { toast } from "@karr/ui/components/sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CameraIcon, Loader2Icon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { orpc } from "@/lib/orpc"
import { client } from "@/util/apifetch"

interface AvatarUploadProps {
    currentAvatar?: string | null
}

export default function AvatarUpload({ currentAvatar }: AvatarUploadProps) {
    const [open, setOpen] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(currentAvatar || "")
    const t = useTranslations("Account")

    const queryClient = useQueryClient()

    const updateAvatarMutation = useMutation(
        orpc.user.updateAvatar.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: orpc.user.info.key()
                })
                toast.success(t("avatar.update-success"), {
                    description: t("avatar.update-success-description")
                })
                setOpen(false)
            },
            onError: (error) => {
                toast.error(t("avatar.update-error"), {
                    description: error.message
                })
            }
        })
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateAvatarMutation.mutate(avatarUrl || null)
    }

    const handleRemoveAvatar = () => {
        updateAvatarMutation.mutate(null)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 bottom-0 size-6 rounded-full bg-white"
                    aria-label={t("avatar.change")}
                >
                    <CameraIcon className="!size-3" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("avatar.title")}</DialogTitle>
                    <DialogDescription>
                        {t("avatar.description")}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="avatar-url">
                                {t("avatar.url-label")}
                            </Label>
                            <Input
                                id="avatar-url"
                                type="url"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="https://example.com/avatar.jpg"
                                disabled={updateAvatarMutation.isPending}
                            />
                            <p className="text-muted-foreground text-sm">
                                {t("avatar.url-help")}
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-4">
                        {currentAvatar && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleRemoveAvatar}
                                disabled={updateAvatarMutation.isPending}
                            >
                                {t("avatar.remove")}
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={updateAvatarMutation.isPending}
                        >
                            {updateAvatarMutation.isPending ? (
                                <>
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                    {t("avatar.updating")}
                                </>
                            ) : (
                                t("avatar.update")
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
