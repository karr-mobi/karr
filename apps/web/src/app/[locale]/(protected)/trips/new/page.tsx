import { getTranslations } from "next-intl/server"
import { auth } from "~/auth/actions"

import NewTripForm from "./newTripForm"

export default async function New() {
    const t = await getTranslations("trips.Create")

    const authState = await auth()
    if (!authState) unauthorized()

    return (
        <article className="mt-6 flex flex-col items-center justify-center gap-4 w-full">
            <h3 className="mb-4">{t("title")}</h3>

            <NewTripForm />
        </article>
    )
}
