import Image from "next/image"
import { useTranslations } from "next-intl"

import { Button } from "@karr/ui/components/button"
import { Separator } from "@karr/ui/components/separator"

import { APPLICATION_NAME } from "@/util/appname"
import logo from "@/assets/logo-tmp.jpg"
import { Link } from "@/i18n/routing"

import LocaleSwitcher from "../_components/LocaleSwitcher"
import LoginAccount from "../_components/loginaccount"
import ThemeSwitch from "../_components/ThemeSwitch"

export default function Header() {
    const t = useTranslations("trips")
    return (
        <header className="bg-primary/4 flex h-16 w-full flex-row items-center justify-between px-4 py-2">
            <div className="flow-inline flex flex-row items-center justify-end">
                <Link href="/" className="flex flex-row items-center justify-start gap-4">
                    <Image
                        alt="Karr"
                        src={logo}
                        width={40}
                        height={40}
                        className="rounded-lg"
                        placeholder="blur"
                    />
                    <h5>{APPLICATION_NAME}</h5>
                </Link>
                <Separator orientation="vertical" className="h-8" />
                <nav className="flex flex-row items-center justify-end gap-4">
                    <Button asChild variant="link" className="text-md px-0">
                        <Link href="/trips/search">{t("title")}</Link>
                    </Button>
                </nav>
            </div>
            <div className="flex flex-row items-center justify-end gap-4">
                <nav className="flex flex-row items-center justify-end gap-4">
                    <LoginAccount />
                </nav>
                <ThemeSwitch />
                <LocaleSwitcher />
            </div>
        </header>
    )
}
