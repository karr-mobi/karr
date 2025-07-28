import { Button } from "@karr/ui/components/button"
import { Image } from "@karr/ui/components/image"
import { LogInIcon, UserIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import { auth } from "~/auth/actions"
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
                        placeholder={[255, 250, 255]}
                        className="size-10 rounded-full"
                    />
                ) : (
                    <UserIcon className="size-10 rounded-full" />
                )}
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
