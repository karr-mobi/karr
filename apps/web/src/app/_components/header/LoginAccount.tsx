import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { LogIn as IconLogIn, User as IconUser } from "lucide-react"

import { Button } from "@karr/ui/components/button"

import { auth, login } from "~/auth/actions"
import { AccountDropdown } from "./AccountDropdown"

export default async function LoginAccount() {
    const t = await getTranslations("auth")

    const authState = await auth()

    return authState ? (
        <AccountDropdown>
            <Button
                variant={authState.avatar ? "link" : "default"}
                size="icon"
                className="mr-0.75 size-10"
            >
                {authState.avatar ? (
                    <Image
                        src={authState.avatar}
                        width={32}
                        height={32}
                        alt="Avatar"
                        className="rounded-full size-10"
                    />
                ) : (
                    <IconUser className="rounded-full size-10" />
                )}
            </Button>
        </AccountDropdown>
    ) : (
        <form action={login}>
            <Button>
                <IconLogIn />
                {t("Login.title")}
            </Button>
        </form>
    )
}
