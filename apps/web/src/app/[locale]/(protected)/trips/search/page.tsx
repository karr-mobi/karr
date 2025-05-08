import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { unauthorized } from "next/navigation"

import Loading from "@/components/Loading"
import { auth } from "~/auth/actions"

import TripList from "./trips"

export default async function Search() {
    const t = await getTranslations("trips")

    const authState = await auth()
    if (!authState) unauthorized()

    return (
        <article className="my-6 max-w-full w-2xl mx-auto">
            <h3>{t("Search.title")}</h3>

            <div className="my-10">
                <Suspense fallback={<Loading />}>
                    <TripList />
                </Suspense>
            </div>
        </article>
    )
}
