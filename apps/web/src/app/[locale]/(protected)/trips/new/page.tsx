import { tryCatch } from "@karr/util"
import { unauthorized } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { apiFetch } from "@/util/apifetch"
import { auth } from "~/auth/actions"
import { Form } from "./new-trip-form"

export const metadata = {
    title: "New Trip",
    description: "Create a new trip"
}

async function getPetrolPrice(): Promise<number> {
    const prices = await tryCatch(apiFetch("/petrol"))

    if (!prices.success) {
        console.error(prices.error)
        return 0
    }

    return Number(prices.value.average_price)
}

export default async function New() {
    const t = await getTranslations("trips.Create")

    const authState = await auth()
    if (!authState) unauthorized()

    return (
        <article className="mt-6 flex w-full flex-col items-center justify-center gap-4">
            <h3 className="mb-4">{t("title")}</h3>

            <Form petrolPrice={getPetrolPrice()} />
        </article>
    )
}
