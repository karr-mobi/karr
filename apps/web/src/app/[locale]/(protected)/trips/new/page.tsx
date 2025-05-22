import { unauthorized } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { auth } from "~/auth/actions"

import { Form } from "./new-trip-form"

export default async function New() {
    const t = await getTranslations("trips.Create")

    const authState = await auth()
    if (!authState) unauthorized()

    return (
        <article className="mt-6 flex w-full flex-col items-center justify-center gap-4">
            <h3 className="mb-4">{t("title")}</h3>

            <Form />
        </article>
    )
}
