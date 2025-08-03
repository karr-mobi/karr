import { Button } from "@karr/ui/components/button"
import { LogInIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { UserAvatar } from "@/components/UserAvatar"
import { Link } from "@/i18n/routing"
import { auth } from "~/auth/actions"
import { AccountDropdown } from "./AccountDropdown"

export default async function LoginAccount() {
    const t = await getTranslations("auth")

    const authState = await auth()

    return authState ? (
        <AccountDropdown>
            <Button variant="link" size="icon" className="mr-0.75 size-10">
                <UserAvatar />
            </Button>
        </AccountDropdown>
    ) : (
        <Button asChild>
            <Link href="/login">
                <LogInIcon />
                {t("Login.sign-in")}
            </Link>
        </Button>
    )
}
