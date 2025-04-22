import { useTranslations } from "next-intl"

import NewTripForm from "./newTripForm"

export default function New() {
    const t = useTranslations("trips.Create")
    return (
        <article className="mt-6 flex flex-col items-center justify-center gap-4 w-full">
            <h3 className="mb-4">{t("title")}</h3>

            <NewTripForm />
        </article>
    )
}
