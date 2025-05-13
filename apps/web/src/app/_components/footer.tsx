import { Separator } from "@karr/ui/components/separator"
import { cn } from "@karr/ui/lib/utils"

import { Link } from "@/i18n/routing"

import { LocaleSwitcher } from "./footer/LocaleSwitcher"
import { ThemeSwitch } from "./footer/ThemeSwitch"
import { isProduction, version } from "./footer/version"

export function Footer({
    className
}: Readonly<{
    className?: string
}>) {
    return (
        <footer
            className={cn(
                className,
                "flex w-full flex-col items-center justify-between py-2 lg:px-4"
            )}
        >
            <Separator />
            <div className="flex h-16 w-full flex-row items-center justify-between rounded-b-md bg-background/50 px-4">
                <div className="flex flex-row items-end justify-start gap-2">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} Karr
                    </p>
                    <Link
                        href={`https://github.com/finxol/karr/releases/tag/v${version}`}
                        className="mb-[1px] px-0 text-muted-foreground text-xs" // 1px mb to fix alignment
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
