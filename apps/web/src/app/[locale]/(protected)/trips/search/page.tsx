import { Suspense } from "react"
import { useTranslations } from "next-intl"

import Loading from "@/components/Loading"

import TripList from "./trips"

export default function Search() {
    const t = useTranslations("trips")

    return (
        <article className="my-6 max-w-full w-2xl mx-auto">
            <h3>{t("Search.title")}</h3>

            <div className="my-10">
                <Suspense fallback={<Loading />}>
                    <TripList userid="4e5c65fc-fa9d-4f9e-baee-c4d5914cec93" />
                </Suspense>
            </div>
        </article>
    )
}
