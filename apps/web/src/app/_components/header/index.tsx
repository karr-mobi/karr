import { cn } from "@karr/ui/lib/utils"
import Image from "next/image"
import { memo } from "react"
import logo from "@/assets/logo-tmp.jpg"
import { Link } from "@/i18n/routing"
import { auth } from "@/lib/auth/actions"
import { APPLICATION_NAME } from "@/util/appname"
import LoginAccount from "./LoginAccount"
import { DesktopNavMenu, MobileNavMenu } from "./NavMenu"

const MemoizedAppName = memo(
    () => <h5>{APPLICATION_NAME}</h5>,
    () => false // Never update
)

export async function Header({
    className
}: Readonly<{
    className?: string
}>) {
    const isAuthenticated = await auth()

    return (
        <header
            className={cn(
                className,
                "sticky top-0 z-50 w-full bg-transparent px-2"
            )}
        >
            <div className="mx-auto mt-2 flex w-full max-w-[60rem] flex-row items-center justify-between rounded-md bg-header-background p-2">
                <div className="flow-inline flex flex-row items-center justify-end">
                    <Link
                        href="/"
                        className="flex flex-row items-center justify-start gap-4"
                    >
                        <Image
                            alt="Karr"
                            src={logo}
                            width={40}
                            height={40}
                            className="rounded-md"
                            placeholder="blur"
                        />
                        <MemoizedAppName />
                    </Link>
                    {isAuthenticated && <DesktopNavMenu />}
                </div>
                <div className="flex flex-row items-center justify-end gap-4">
                    {isAuthenticated && <MobileNavMenu />}
                    <nav className="flex flex-row items-center justify-end gap-4">
                        <LoginAccount />
                    </nav>
                </div>
            </div>
        </header>
    )
}
