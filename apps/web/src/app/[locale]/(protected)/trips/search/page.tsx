import type { Metadata } from "next"
import { unauthorized } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import Loading from "@/components/Loading"
import { auth } from "~/auth/actions"

import TripList from "./trips"
import { url } from "./url"

export const metadata: Metadata = {
    title: "Search",
    description: "Search for trips"
}

export default async function Search() {
    const t = await getTranslations("trips")

    const authState = await auth()
    if (!authState) unauthorized()

    return (
        <>
            <h3 className="my-4">{t("Search.title")}</h3>

            <div className="w-[calc(100vw-2rem)]">
                <Suspense fallback={<Loading />}>
                    <TripList url={url} />
                </Suspense>
            </div>
        </>
    )
}
