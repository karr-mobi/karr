import { Button } from "@karr/ui/components/button"

import { Link } from "@/i18n/routing"

import ThemeSwitch from "./ThemeSwitch"
import { isProduction, version } from "./version"

export default function Footer() {
    return (
        <footer className="bg-background/50 flex h-16 w-full flex-row items-center justify-between px-4 py-2">
            <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Karr
            </p>

            <div>
                <Button variant="link" asChild className="text-sm text-muted-foreground">
                    <Link
                        href={`https://github.com/finxol/karr/releases/tag/v${version}`}
                        target="_blank"
                    >
                        Version {version} {isProduction ? "" : "(dev)"}
                    </Link>
                </Button>
                <ThemeSwitch />
            </div>
        </footer>
    )
}
