import { unauthorized } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import Loading from "@/components/Loading"
import { auth } from "~/auth/actions"
import TripInfo from "./tripinfo"

export const metadata = {
    title: "Trip Details",
    description: "View your trip details"
}

export default async function TripPage({
    params
}: {
    params: { id: string; locale: string }
}) {
    const t = await getTranslations("Trips")

    const authState = await auth()
    if (!authState) unauthorized()

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="font-bold text-3xl">{t("trip-details")}</h1>
                <p className="mt-2 text-muted-foreground">
                    {t("trip-details-subtitle")}
                </p>
            </div>
            <Suspense fallback={<Loading />}>
                <TripInfo tripId={params.id} />
            </Suspense>
        </div>
    )
}
