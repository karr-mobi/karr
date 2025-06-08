import { unauthorized } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

import Loading from "@/components/Loading"
import { auth } from "~/auth/actions"

import UserInfo from "./userinfo"

export const metadata = {
    title: "Account",
    description: "Manage your Karr account"
}

export default async function AccountPage() {
    const t = await getTranslations("auth.Account")

    const authState = await auth()
    if (!authState) unauthorized()

    return (
        <>
            <h1>{t("title")}</h1>
            <code>{JSON.stringify(authState, null, 2)}</code>
            <Suspense fallback={<Loading />}>
                <UserInfo />
            </Suspense>
        </>
    )
}
