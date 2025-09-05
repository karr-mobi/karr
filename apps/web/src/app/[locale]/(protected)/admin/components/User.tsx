"use client"

import { Badge } from "@karr/ui/components/badge"
import { Button } from "@karr/ui/components/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@karr/ui/components/collapsible"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@karr/ui/components/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@karr/ui/components/drawer"
import { Label } from "@karr/ui/components/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@karr/ui/components/select"
import { Skeleton } from "@karr/ui/components/skeleton"
import { Spinner } from "@karr/ui/components/spinner"
import { useMediaQuery } from "@karr/ui/hooks"
import { useDisplayName } from "@karr/ui/hooks/users"
import {
    BadgeCheckIcon,
    Ban,
    Calendar1Icon,
    CircleCheckIcon,
    CircleChevronDownIcon,
    MailIcon,
    UserIcon
} from "lucide-react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import type { TUsersList } from "@/api/routes/admin"
import { useAuth } from "@/app/auth/context"
import { Link } from "@/i18n/routing"
import { useBlockMutations, useRoleMutation, useVerifyMutation } from "./hooks"

export function UsersSkeleton() {
    return (
        <div className="flex flex-row flex-wrap gap-2">
            {["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"].map(
                (id) => (
                    <div
                        key={id}
                        className="group mb-4 flex flex-wrap items-center justify-between rounded-lg border bg-card p-4 md:w-[49%]"
                    >
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="mt-1 flex items-center gap-2">
                                <Skeleton className="h-4 w-25 rounded-full" />
                                <Skeleton className="h-4 w-15 rounded-full" />
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    )
}

function UserCard({ user }: { user: TUsersList[number] }) {
    const { authState } = useAuth()
    const displayName = useDisplayName(user)
    const t = useTranslations("Admin")

    return (
        <>
            <div className="flex w-full items-center justify-start gap-2 font-medium">
                {user.avatar ? (
                    <Image
                        src={user.avatar}
                        alt={displayName}
                        className="me-2 h-10 w-10 rounded-full"
                        width="40"
                        height="40"
                    />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <UserIcon className="h-5 w-5" />
                    </div>
                )}
                {user.provider === authState?.provider &&
                    user.remoteId === authState?.remoteId && (
                        <Badge variant="secondary">{t("you")}</Badge>
                    )}
                <div>{displayName}</div>
                {user.role === "admin" && (
                    <Badge variant="default">{user.role}</Badge>
                )}
                {user.blocked && (
                    <Badge variant="destructive">{t("blocked")}</Badge>
                )}
            </div>
        </>
    )
}

function UserDetails({ user }: { user: TUsersList[number] }) {
    function Role() {
        const t = useTranslations("Admin")

        const [role, setRole] = useState(user.role)

        const roleMutation = useRoleMutation(setRole)

        return (
            <>
                <Label>{t("change-role", { name: user.nickname })}</Label>
                <Select
                    defaultValue={role}
                    value={role}
                    onValueChange={(value) => {
                        roleMutation.mutate({
                            remoteId: user.remoteId,
                            provider: user.provider,
                            role: value as "admin" | "user"
                        })
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("select-role")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{t("select-role")}</SelectLabel>
                            <SelectItem value="admin">{t("admin")}</SelectItem>
                            <SelectItem value="user">{t("user")}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </>
        )
    }

    const { blockUserMutation, unblockUserMutation } = useBlockMutations()
    const verifyUserMutation = useVerifyMutation()
    const [openOptions, setOpenOptions] = useState(false)

    const t = useTranslations("Admin")
    const locale = useLocale()

    return (
        <div className="flex flex-col gap-4">
            <div className="mt-1 flex items-center gap-2">
                {user.role === "admin" && (
                    <Badge variant="default">{user.role}</Badge>
                )}
                <Badge variant="outline" className="capitalize">
                    {user.provider}
                </Badge>
                {!user.verified && (
                    <Badge variant="outline-destructive">
                        {t("not-verified")}
                    </Badge>
                )}
                {user.blocked && (
                    <Badge variant="destructive">{t("blocked")}</Badge>
                )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-3">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">
                        {`${user.firstName} `}
                        {user.lastName}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <Calendar1Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                        {t("joined", {
                            date: new Date(user.createdAt).toLocaleDateString(
                                locale
                            )
                        })}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                </div>
            </div>

            <div className="mt-2 flex flex-col-reverse gap-2 empty:hidden sm:flex-row sm:justify-start">
                {user.role === "user" &&
                    (user.blocked ? (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                                unblockUserMutation.mutate({
                                    provider: user.provider,
                                    remoteId: user.remoteId
                                })
                            }
                            disabled={unblockUserMutation.isPending}
                        >
                            <CircleCheckIcon className="mr-1 h-4 w-4" />
                            {t("unblock")}
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                                blockUserMutation.mutate({
                                    provider: user.provider,
                                    remoteId: user.remoteId
                                })
                            }
                            disabled={blockUserMutation.isPending}
                        >
                            <Ban className="mr-1 h-4 w-4" />
                            {t("block")}
                        </Button>
                    ))}

                {!user.verified && (
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                            verifyUserMutation.mutate({
                                provider: user.provider,
                                remoteId: user.remoteId
                            })
                        }
                        disabled={verifyUserMutation.isPending}
                    >
                        {verifyUserMutation.isPending ? (
                            <Spinner />
                        ) : (
                            <BadgeCheckIcon className="me-1 h-4 w-4" />
                        )}
                        {t("verify")}
                    </Button>
                )}
            </div>
            <Collapsible open={openOptions} onOpenChange={setOpenOptions}>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full text-sm">
                        <CircleChevronDownIcon
                            className={`me-1 h-4 w-4 ${openOptions && "rotate-180"} transition duration-300 ease-out`}
                        />
                        {t("more-options")}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                    <Role />
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}

export function User({ user }: { user: TUsersList[number]; key: string }) {
    const desktop = useMediaQuery("(min-width: 768px)")

    const displayName = useDisplayName(user)
    const t = useTranslations("Admin")

    const Title = () => (
        <Link href={`/profile/${user.id}`} className="flex items-center gap-4">
            {user.avatar ? (
                <Image
                    src={user.avatar}
                    alt={displayName}
                    className="h-10 w-10 rounded-full"
                    width="40"
                    height="40"
                />
            ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <UserIcon className="h-5 w-5" />
                </div>
            )}
            {displayName}
        </Link>
    )

    if (desktop) {
        return (
            <Dialog key={user.id}>
                <DialogTrigger asChild>
                    <div className="group flex w-full cursor-pointer items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50 md:w-[49%]">
                        <DialogTitle className="sr-only">
                            {t("open-user-details")}
                        </DialogTitle>
                        <UserCard user={user} />
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <Title />
                        </DialogTitle>
                    </DialogHeader>
                    <UserDetails user={user} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer key={user.id}>
            <DrawerTrigger asChild>
                <div className="group flex w-full cursor-pointer items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50 md:w-[49%]">
                    <DrawerTitle className="sr-only">
                        {t("open-user-details")}
                    </DrawerTitle>
                    <UserCard user={user} />
                </div>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        <Title />
                    </DrawerTitle>
                </DrawerHeader>
                <div className="mx-4 mb-6">
                    <UserDetails user={user} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}
