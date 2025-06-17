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
    const t = await getTranslations("Account")

    const authState = await auth()
    if (!authState) unauthorized()

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="font-bold text-3xl">{t("title")}</h1>
                <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
            </div>
            <Suspense fallback={<Loading />}>
                <UserInfo avatar={authState.avatar} />
            </Suspense>
        </div>
    )
}
