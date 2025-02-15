import { Suspense } from "react"
import { useTranslations } from "next-intl"

import Loading from "@/components/Loading"

import NewTripForm from "./newTripForm"

export default function New() {
    const t = useTranslations("trips.Create")
    return (
        <article className="mt-6">
            <h3 className="mb-4">{t("title")}</h3>

            <Suspense fallback={<Loading />}>
                <NewTripForm />
            </Suspense>
        </article>
    )
}
