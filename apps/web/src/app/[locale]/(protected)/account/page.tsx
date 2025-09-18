//biome-ignore-all lint/nursery/noProcessGlobal: Webpack can't handle node: imports
//biome-ignore-all lint/style/noProcessEnv: Just for dev

import type { Metadata } from "next"
import { unauthorized } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import Loading from "@/components/Loading"
import { auth } from "@/lib/auth/actions"
import { UserTrips } from "./UserTrips"
import UserInfo from "./userinfo"

export const metadata: Metadata = {
    title: "Account",
    description: "Manage your Karr account"
}

export default async function AccountPage() {
    const t = await getTranslations("Account")

    const authState = await auth()
    if (!authState) unauthorized()

    return (
        <div className="container mx-auto py-8">
            <Suspense
                fallback={
                    <>
                        <div className="mb-8">
                            <h1 className="font-bold text-3xl">{t("title")}</h1>
                            <p className="mt-2 text-muted-foreground">
                                {t("subtitle")}
                            </p>
                        </div>
                        <Loading />
                    </>
                }
            >
                <UserInfo />
            </Suspense>
            <Suspense fallback={<Loading />}>
                <UserTrips />
            </Suspense>
            {process.env.NODE_ENV !== "production" && (
                <details className="mt-4 ml-4 text-sm">
                    <summary className="text-muted-foreground text-xs">
                        Raw jwt data
                    </summary>
                    <pre>{JSON.stringify(authState, null, 2)}</pre>
                </details>
            )}
        </div>
    )
}
