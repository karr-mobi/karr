import { GithubLogo } from "@karr/ui/logos/github"
import { GoogleLogo } from "@karr/ui/logos/google"
import { PasswordLogo } from "@karr/ui/logos/password"
import { useTranslations } from "next-intl"
import { LoginButton } from "./LoginButton"
import { PROVIDERS } from "./providers"

const LOGOS = {
    google: <GoogleLogo />,
    github: <GithubLogo />,
    code: <PasswordLogo />,
    password: <PasswordLogo />
}

export default function Login() {
    const t = useTranslations("auth.Login")

    return (
        <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <h6 className="mt-4">{t("choose-provider")}</h6>
                </div>
                <div className="mt-10 flex flex-col items-center justify-center gap-4">
                    {PROVIDERS.map((provider) => (
                        <LoginButton
                            key={provider}
                            provider={provider}
                            logo={LOGOS[provider]}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
