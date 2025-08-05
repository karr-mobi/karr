import { GithubLogo } from "@karr/ui/logos/github"
import { GoogleLogo } from "@karr/ui/logos/google"
import { PasswordLogo } from "@karr/ui/logos/password"
import { SendIcon } from "lucide-react"
import type { Metadata } from "next"
import { useTranslations } from "next-intl"
import { LoginButton } from "./LoginButton"
import { LocalProviders, OAuthProviders } from "./providers"

const LOGOS = {
    google: <GoogleLogo />,
    github: <GithubLogo />,
    code: <SendIcon />,
    password: <PasswordLogo />
}

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your Karr account"
}

export default function Login() {
    const t = useTranslations("auth.Login")

    return (
        <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center">
                {OAuthProviders.length > 0 && (
                    <div className="flex flex-col items-center justify-center">
                        <h6 className="mt-4">{t("choose-provider")}</h6>
                    </div>
                )}
                <div className="mt-10 flex flex-col items-center justify-center gap-4">
                    {OAuthProviders.map((provider) => (
                        <LoginButton
                            key={provider}
                            provider={provider}
                            logo={LOGOS[provider]}
                        />
                    ))}
                    {OAuthProviders.length > 0 && LocalProviders.length > 0 && (
                        <div className="flex w-96 max-w-[80vw] items-center justify-center">
                            <div className="flex-1 border-gray-300 border-t"></div>
                            <span className="px-4 text-gray-500 text-sm">
                                {t("or")}
                            </span>
                            <div className="flex-1 border-gray-300 border-t"></div>
                        </div>
                    )}
                    {LocalProviders.length > 0 && (
                        <div className="flex flex-col items-center justify-center">
                            <h6 className="mt-4">{t("login-with-email")}</h6>
                        </div>
                    )}
                    {LocalProviders.map((provider) => (
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
