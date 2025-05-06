"use client"

import { useTransition } from "react"
import { useTranslations } from "next-intl"
import { LogOut as IconLogOut, User as IconUser } from "lucide-react"

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
import { logout } from "~/auth/actions"
import { Link } from "@/i18n/routing"
import { UserProperties } from "@karr/auth/subjects"

export function AccountDropdown({
    children,
    userdata
}: {
    children?: React.ReactNode
    userdata: UserProperties
}) {
    const t = useTranslations("auth")

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
                    {userdata.nickname ||
                        (userdata.firstName
                            ? userdata.firstName + " " + userdata.lastName
                            : t("Dropdown.title"))}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link
                            href="/account"
                            className="flex items-center justify-start gap-2 w-full cursor-pointer"
                        >
                            <IconUser
                                size={16}
                                strokeWidth={2}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            {t("Account.title")}
                        </Link>
                    </DropdownMenuItem>
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
                    <IconLogOut
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
