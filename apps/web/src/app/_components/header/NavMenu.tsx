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
    CarFrontIcon,
    ChevronDownIcon,
    CirclePlusIcon,
    type LucideIcon,
    MenuIcon,
    SearchIcon,
    User2Icon
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Fragment } from "react"
import type { Messages } from "@/../global"

import { Link } from "@/i18n/routing"

type LinkItem = { label: NavBarTranslationKey; href: string; icon?: LucideIcon }

type NavBarTranslationKey = keyof Messages["NavBar"]

type MenuItem =
    | {
          type: "dropdown"
          label: NavBarTranslationKey
          icon?: LucideIcon
          items: LinkItem[]
      }
    | {
          type: "item"
          label: NavBarTranslationKey
          icon?: LucideIcon
          href: string
      }

const menuItems: MenuItem[] = [
    {
        type: "dropdown",
        label: "trips",
        icon: CarFrontIcon,
        items: [
            { label: "search-trips", href: "/trips/search", icon: SearchIcon },
            { label: "new-trip", href: "/trips/new", icon: CirclePlusIcon }
        ]
    },
    {
        type: "item",
        label: "account",
        icon: User2Icon,
        href: "/account"
    }
]

export function DesktopNavMenu() {
    const t = useTranslations("NavBar")

    return (
        <div className="hidden sm:block">
            <nav className="flex items-center space-x-4">
                <Separator orientation="vertical" className="h-8" />
                {menuItems.map((cat, index) =>
                    cat.type === "item" ? (
                        <Button
                            key={`desktop-menu-item-${index}-${String(cat.label)}`}
                            variant="ghost"
                            className="flex items-center gap-2"
                            asChild
                        >
                            <Link
                                href={cat.href}
                                className="flex w-full cursor-pointer items-center justify-start gap-2"
                            >
                                {cat.icon ? (
                                    <cat.icon
                                        size={16}
                                        strokeWidth={2}
                                        className="size-4 text-stone-800"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <div className="w-4" />
                                )}
                                {t(cat.label)}
                            </Link>
                        </Button>
                    ) : (
                        <DropdownMenu
                            key={`desktop-menu-category-${index}-${String(cat.label)}`}
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
                                            className="size-4 text-stone-800"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <ChevronDownIcon
                                            size={16}
                                            strokeWidth={2}
                                            className="size-4 text-stone-800"
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
                                            key={`desktop-menu-item-${item.href}`}
                                            asChild
                                        >
                                            <Link
                                                href={item.href}
                                                className="flex w-full cursor-pointer items-center justify-start gap-2"
                                            >
                                                {item.icon ? (
                                                    <item.icon
                                                        size={16}
                                                        strokeWidth={2}
                                                        className="size-4 text-stone-800"
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
                    )
                )}
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
                        <MenuIcon
                            className="opacity-60"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {menuItems.map((cat, index) => (
                        <Fragment
                            key={`menu-category-${index}-${String(cat.label)}`}
                        >
                            <DropdownMenuLabel>
                                {t(cat.label)}
                            </DropdownMenuLabel>
                            <DropdownMenuGroup>
                                {cat.type === "item" ? (
                                    <DropdownMenuItem
                                        key={`menu-item-${cat.href}`}
                                        asChild
                                    >
                                        <Link
                                            key={`desktop-menu-item-${index}-${String(cat.label)}`}
                                            href={cat.href}
                                            className="flex w-full cursor-pointer items-center justify-start gap-2"
                                        >
                                            {cat.icon ? (
                                                <cat.icon
                                                    size={16}
                                                    strokeWidth={2}
                                                    className="size-4 text-stone-800"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <div className="w-4" />
                                            )}
                                            {t(cat.label)}
                                        </Link>
                                    </DropdownMenuItem>
                                ) : (
                                    cat.items.map((item) => (
                                        <DropdownMenuItem
                                            key={`menu-item-${item.href}`}
                                            asChild
                                        >
                                            <Link
                                                href={item.href}
                                                className="flex items-center justify-start gap-2"
                                            >
                                                {item.icon ? (
                                                    <item.icon
                                                        size={16}
                                                        strokeWidth={2}
                                                        className="size-4 text-stone-800"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <div className="ms-4" />
                                                )}
                                                {t(item.label)}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))
                                )}
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
