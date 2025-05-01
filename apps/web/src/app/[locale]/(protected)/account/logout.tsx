"use client"

import { useTranslations } from "next-intl"

import { Button } from "@karr/ui/components/button"

import { logout } from "~/auth/actions"

export default function Logout() {
    const t = useTranslations("auth")

    return (
        <form action={logout}>
            <Button className="mb-6 mt-2">{t("Logout.title")}</Button>
        </form>
    )
}
