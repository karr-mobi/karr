import { Button } from "@karr/ui/components/button"
import { Separator } from "@karr/ui/components/separator"

import { Link } from "@/i18n/routing"

import { LocaleSwitcher } from "./footer/LocaleSwitcher"
import { ThemeSwitch } from "./footer/ThemeSwitch"
import { isProduction, version } from "./footer/version"

export default function Footer() {
    return (
        <footer className="bg-background/50 flex w-full flex-col items-center justify-between px-4 py-2">
            <Separator />
            <div className="bg-background/50 flex h-16 w-full flex-row items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Karr
                </p>

                <div className="flex flex-row gap-3">
                    <Button
                        variant="link"
                        asChild
                        className="text-xs text-muted-foreground px-0"
                    >
                        <Link
                            href={`https://github.com/finxol/karr/releases/tag/v${version}`}
                            target="_blank"
                        >
                            {version} {isProduction ? "" : "(dev)"}
                        </Link>
                    </Button>
                    <LocaleSwitcher />
                    <ThemeSwitch />
                </div>
            </div>
        </footer>
    )
}
