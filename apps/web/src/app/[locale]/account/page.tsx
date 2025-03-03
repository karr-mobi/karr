import { Suspense } from "react"
import { useTranslations } from "next-intl"

import Loading from "@/components/Loading"

import Logout from "./logout"
import UserInfo from "./userinfo"

export default function AccountPage() {
    const t = useTranslations("auth.Account")

    return (
        <div className="flex flex-col gap-4 items-start max-w-screen overflow-scroll">
            <h1>{t("title")}</h1>
            <Suspense fallback={<Loading />}>
                <UserInfo userid="4e5c65fc-fa9d-4f9e-baee-c4d5914cec93" />
            </Suspense>
            <Logout />
        </div>
    )
}
