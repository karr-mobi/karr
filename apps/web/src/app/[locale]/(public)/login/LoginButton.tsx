"use client"

import { Button } from "@karr/ui/components/button"
import { LoaderIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import { loginWithProvider } from "@/app/auth/actions"

export function LoginButton({
    provider,
    logo
}: {
    provider: string
    logo: React.ReactNode
}) {
    const [isPending, startTransition] = useTransition()
    const [isClicked, setIsClicked] = useState(false)
    const t = useTranslations("auth.Login")

    // Using a transition here because Nextjs client side routing was
    // causing issues when trying to redirect to the auth url
    const handleLogin = () => {
        setIsClicked(true)
        startTransition(async () => {
            const result = await loginWithProvider({ provider })
            window.location.href = result.redirectTo
        })
    }

    return (
        <Button
            className="h-12 w-96 max-w-[80vw]"
            variant="outline"
            onClick={handleLogin}
            disabled={isPending || isClicked}
        >
            {isPending || isClicked ? (
                <>
                    <LoaderIcon className="animate-spin [animation-duration:1500ms]" />
                    {`${t("redirecting")} `}
                </>
            ) : (
                <>
                    {logo}
                    {`${t("continue-with")} `}
                    {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </>
            )}
        </Button>
    )
}
