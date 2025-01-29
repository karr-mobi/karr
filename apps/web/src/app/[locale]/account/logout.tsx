"use client"

import { useTranslations } from "next-intl"

import { Button } from "@karr/ui/components/button"

import { apiFetch } from "@/util/apifetch"
import { useRouter } from "@/i18n/routing"

export default function Logout() {
    const t = useTranslations("auth")
    const router = useRouter()

    async function logout() {
        await apiFetch("/auth/logout", {
            method: "GET"
        })
        router.push("/")
        router.refresh()
    }

    return (
        <Button onClick={logout} className="mb-6 mt-2">
            {t("Logout.title")}
        </Button>
    )
}
