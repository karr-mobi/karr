import { User as IconUser } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "@karr/ui/components/button"

import { Link } from "@/i18n/routing"
import { auth, login } from "~/auth/actions"
import { LogIn as IconLogIn } from "lucide-react"

export default async function LoginAccount() {
    const t = await getTranslations("auth")

    const isAuthenticated = await auth()

    return (
        <>
            {isAuthenticated ? (
                <Button asChild>
                    <Link href="/account">
                        <IconUser />
                        <span className="hidden sm:block">{t("Account.title")}</span>
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
