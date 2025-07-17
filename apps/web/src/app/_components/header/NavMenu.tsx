"use client"

import { Button } from "@karr/ui/components/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@karr/ui/components/dropdown"
import { Separator } from "@karr/ui/components/separator"
import {
    CarFront as IconCarFront,
    ChevronDown as IconChevronDown,
    CirclePlus as IconCirclePlus,
    Menu as IconMenu,
    Search as IconSearch,
    type LucideIcon
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Fragment } from "react"
import type { Messages } from "@/../global"

import { Link } from "@/i18n/routing"

type LinkItem = { label: NavBarTranslationKey; url: string; icon?: LucideIcon }

type NavBarTranslationKey = keyof Messages["NavBar"]

type MenuItem = {
    label: NavBarTranslationKey
    icon?: LucideIcon
    items: LinkItem[]
}

const menuItems: MenuItem[] = [
    {
        label: "trips",
        icon: IconCarFront,
        items: [
            { label: "search-trips", url: "/trips/search", icon: IconSearch },
            { label: "new-trip", url: "/trips/new", icon: IconCirclePlus }
        ]
    }
]

export function DesktopNavMenu() {
    const t = useTranslations("NavBar")

    return (
        <div className="hidden sm:block">
            <nav className="flex items-center space-x-4">
                <Separator orientation="vertical" className="h-8" />
                {menuItems.map((cat, index) => (
                    <DropdownMenu
                        key={`desktop-menu-category-${index}-${cat.label}`}
                    >
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2"
                            >
                                {cat.icon ? (
                                    <cat.icon
                                        size={16}
                                        strokeWidth={2}
                                        className="opacity-60"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <IconChevronDown
                                        size={16}
                                        strokeWidth={2}
                                        className="opacity-60"
                                        aria-hidden="true"
                                    />
                                )}
                                {t(cat.label)}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                {cat.items.map((item) => (
                                    <DropdownMenuItem
                                        key={`desktop-menu-item-${item.url}`}
                                        asChild
                                    >
                                        <Link
                                            href={item.url}
                                            className="flex w-full cursor-pointer items-center justify-start gap-2"
                                        >
                                            {item.icon ? (
                                                <item.icon
                                                    size={16}
                                                    strokeWidth={2}
                                                    className="opacity-60"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                cat.items.filter(
                                                    (it) => it.icon
                                                ).length > 0 && (
                                                    <div className="w-4" />
                                                )
                                            )}
                                            {t(item.label)}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ))}
            </nav>
        </div>
    )
}

export function MobileNavMenu() {
    const t = useTranslations("NavBar")

    return (
        <div className="block sm:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <IconMenu
                            className="opacity-60"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {menuItems.map((cat, index) => (
                        <Fragment key={`menu-category-${index}-${cat.label}`}>
                            <DropdownMenuLabel>
                                {t(cat.label)}
                            </DropdownMenuLabel>
                            <DropdownMenuGroup>
                                {cat.items.map((item) => (
                                    <DropdownMenuItem
                                        key={`menu-item-${item.url}`}
                                        asChild
                                    >
                                        <Link
                                            href={item.url}
                                            className="flex items-center justify-start gap-2"
                                        >
                                            {item.icon ? (
                                                <item.icon
                                                    size={16}
                                                    strokeWidth={2}
                                                    className="opacity-60"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <div className="ms-4" />
                                            )}
                                            {t(item.label)}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                            {menuItems.length > 1 &&
                                menuItems.at(-1) !== cat && (
                                    <DropdownMenuSeparator />
                                )}
                        </Fragment>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
