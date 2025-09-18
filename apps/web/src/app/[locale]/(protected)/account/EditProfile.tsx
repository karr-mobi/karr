"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@karr/ui/components/avatar"
import { Button } from "@karr/ui/components/button"
import {
    Dialog,
    DialogClose,
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
import { Spinner } from "@karr/ui/components/spinner"
import { Textarea } from "@karr/ui/components/textarea"
import { useInitials } from "@karr/ui/hooks/users"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PenBoxIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { type EditProfile, EditProfileSchema } from "@/db/schemas/profile"
import { orpc } from "@/lib/orpc"
import { FieldInfo } from "@/util/forms"
import AvatarUpdate from "./AvatarUpdate"

function Form({
    user,
    closeDialog
}: {
    user: EditProfile
    closeDialog: () => void
}) {
    const t = useTranslations("Account.editProfile")
    const queryClient = useQueryClient()
    const initials = useInitials(user)

    const profileMutation = useMutation(
        orpc.user.updateProfile.mutationOptions({
            onSuccess: () => {
                toast.success(t("updated"))
                queryClient.invalidateQueries({
                    queryKey: orpc.user.info.queryKey()
                })
                closeDialog()
            }
        })
    )

    const form = useForm({
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            nickname: user.nickname,
            bio: user.bio,
            avatar: user.avatar,
            phone: user.phone
        },
        onSubmit: async (form) => {
            await profileMutation.mutateAsync(form.value)
        }
    })

    return (
        <>
            <div className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <AvatarUpdate currentAvatar={user.avatar} />
            </div>
            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
            >
                <section className="flex flex-row gap-4">
                    <form.Field
                        name="firstName"
                        validators={{
                            onChange: EditProfileSchema.shape.firstName
                        }}
                        children={(field) => {
                            return (
                                <div>
                                    <Label htmlFor={field.name}>
                                        {t("first-name")}
                                    </Label>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )
                        }}
                    />
                    <form.Field
                        name="lastName"
                        validators={{
                            onChange: EditProfileSchema.shape.lastName
                        }}
                        children={(field) => (
                            <div>
                                <Label htmlFor={field.name}>
                                    {t("last-name")}
                                </Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                />
                                <FieldInfo field={field} />
                            </div>
                        )}
                    />
                </section>

                <form.Field
                    name="nickname"
                    validators={{
                        onChange: EditProfileSchema.shape.nickname
                    }}
                    children={(field) => (
                        <div>
                            <Label htmlFor={field.name}>{t("nickname")}</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value ?? undefined}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />
                            <FieldInfo field={field} />
                        </div>
                    )}
                />

                <form.Field
                    name="bio"
                    validators={{
                        onChange: EditProfileSchema.shape.bio
                    }}
                    children={(field) => (
                        <div>
                            <Label htmlFor={field.name}>{t("bio.label")}</Label>
                            <Textarea
                                id={field.name}
                                name={field.name}
                                placeholder={t("bio.placeholder")}
                                value={field.state.value ?? undefined}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />
                            <FieldInfo field={field} />
                        </div>
                    )}
                />

                <DialogFooter className="mt-8">
                    {!profileMutation.isPending && (
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={profileMutation.isPending}
                            >
                                {t("cancel")}
                            </Button>
                        </DialogClose>
                    )}
                    <Button type="submit" disabled={profileMutation.isPending}>
                        {profileMutation.isPending ? <Spinner /> : t("save")}
                    </Button>
                </DialogFooter>
            </form>
        </>
    )
}

export function Edit({ user }: { user: EditProfile }) {
    const t = useTranslations("Account.editProfile")
    const [open, setOpen] = useState(false)

    const closeDialog = () => {
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <PenBoxIcon />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>{t("description")}</DialogDescription>
                </DialogHeader>

                <Form user={user} closeDialog={closeDialog} />
            </DialogContent>
        </Dialog>
    )
}
