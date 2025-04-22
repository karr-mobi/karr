import { Separator } from "@karr/ui/components/separator"

import { Link } from "@/i18n/routing"

import { LocaleSwitcher } from "./footer/LocaleSwitcher"
import { ThemeSwitch } from "./footer/ThemeSwitch"
import { isProduction, version } from "./footer/version"

export function Footer() {
    return (
        <footer className="flex w-full flex-col items-center justify-between px-4 py-2">
            <Separator />
            <div className="bg-background/50 px-4 flex h-16 w-full flex-row items-center justify-between rounded-b-md">
                <div className="flex flex-row items-end justify-start gap-2">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Karr
                    </p>
                    <Link
                        href={`https://github.com/finxol/karr/releases/tag/v${version}`}
                        className="text-xs text-muted-foreground px-0 mb-[1px]" // 1px mb to fix alignment
                        target="_blank"
                    >
                        v{version} {isProduction ? "" : "(dev)"}
                    </Link>
                </div>

                <div className="flex flex-row gap-3">
                    <LocaleSwitcher />
                    <ThemeSwitch />
                </div>
            </div>
        </footer>
    )
}
