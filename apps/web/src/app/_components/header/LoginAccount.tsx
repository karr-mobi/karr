import { User as IconUser } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

import { Button } from "@karr/ui/components/button"

import { Link } from "@/i18n/routing"
import { auth, login } from "~/auth/actions"
import { LogIn as IconLogIn } from "lucide-react"

export default async function LoginAccount() {
    const t = await getTranslations("auth")

    const authState = await auth()

    return (
        <>
            {authState ? (
                <Button
                    variant="link"
                    size="icon"
                    className="mr-0.75 size-10"
                    asChild
                >
                    <Link href="/account">
                        {authState.avatar ? (
                            <Image
                                src={authState.avatar}
                                width={32}
                                height={32}
                                alt="Avatar"
                                className="rounded-full size-10"
                            />
                        ) : (
                            <IconUser />
                        )}
                    </Link>
                </Button>
            ) : (
                <>
                    <form action={login}>
                        <Button>
                            <IconLogIn />
                            {t("Login.title")}
                        </Button>
                    </form>
                </>
            )}
        </>
    )
}
