import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { unauthorized } from "next/navigation"

import Loading from "@/components/Loading"
import { auth } from "~/auth/actions"

import UserInfo from "./userinfo"

export default async function AccountPage() {
    const t = await getTranslations("auth.Account")

    const authState = await auth()
    if (!authState) unauthorized()

    return (
        <div className="flex flex-col gap-4 items-start max-w-screen overflow-scroll">
            <h1>{t("title")}</h1>
            <pre>{JSON.stringify(authState, null, 2)}</pre>
            <Suspense fallback={<Loading />}>
                <UserInfo />
            </Suspense>
        </div>
    )
}
