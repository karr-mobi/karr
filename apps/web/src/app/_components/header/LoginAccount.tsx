import { Button } from "@karr/ui/components/button"
import { LogIn as IconLogIn, User as IconUser } from "lucide-react"
import Image from "next/image"
import { getTranslations } from "next-intl/server"

import { auth, login } from "~/auth/actions"
import { AccountDropdown } from "./AccountDropdown"

export default async function LoginAccount() {
    const t = await getTranslations("auth")

    const authState = await auth()

    return authState ? (
        <AccountDropdown userdata={authState}>
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
                        className="size-10 rounded-full"
                    />
                ) : (
                    <IconUser className="size-10 rounded-full" />
                )}
            </Button>
        </AccountDropdown>
    ) : (
        <form action={login}>
            <Button type="submit">
                <IconLogIn />
                {t("Login.title")}
            </Button>
        </form>
    )
}
