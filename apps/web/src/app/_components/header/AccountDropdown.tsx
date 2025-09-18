"use client"

import { Badge } from "@karr/ui/components/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@karr/ui/components/dropdown"
import { LogOutIcon, ShieldUserIcon, UserIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTransition } from "react"
import { useAdmin } from "@/hooks/admin"
import { useUser } from "@/hooks/user"
import { Link } from "@/i18n/routing"
import { logout } from "@/lib/auth/actions"

export function AccountDropdown({ children }: { children?: React.ReactNode }) {
    const t = useTranslations("auth")
    const { data: user } = useUser()
    const isAdmin = useAdmin()

    const [isPending, startTransition] = useTransition()

    const logoutTransition = () => {
        startTransition(logout)
    }

    const showDev = false

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                    {user?.nickname ||
                        (user?.firstName
                            ? `${user.firstName} ${user.lastName}`
                            : t("Dropdown.title"))}
                    {isAdmin && (
                        <Badge className="ms-2" variant="secondary">
                            Admin
                        </Badge>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link
                            href="/account"
                            className="flex w-full cursor-pointer items-center justify-start gap-2"
                        >
                            <UserIcon
                                size={16}
                                strokeWidth={2}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            {t("account")}
                        </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                        <DropdownMenuItem asChild>
                            <Link
                                href="/admin"
                                className="flex w-full cursor-pointer items-center justify-start gap-2"
                            >
                                <ShieldUserIcon
                                    size={16}
                                    strokeWidth={2}
                                    className="opacity-60"
                                    aria-hidden="true"
                                />
                                {t("admin")}
                            </Link>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {showDev && (
                    <>
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    Invite users
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem>
                                            Email
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Message
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            More...{" "}
                                            <DropdownMenuShortcut>
                                                ⇧⌘Q
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem
                    disabled={isPending}
                    onSelect={logoutTransition}
                    className="cursor-pointer"
                >
                    <LogOutIcon
                        size={16}
                        strokeWidth={2}
                        className="opacity-60"
                        aria-hidden="true"
                    />
                    {t("Logout.title")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
