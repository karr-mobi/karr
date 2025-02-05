import { Suspense } from "react"
import { Plus as IconPlus } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@karr/ui/components/button"

import { Link } from "@/i18n/routing"
import Loading from "@/components/Loading"

import TripList from "./trips"

export default function Search() {
    const t = useTranslations("trips")

    return (
        <article className="my-6 max-w-full w-2xl">
            <h3>{t("Search.title")}</h3>

            <Button variant="default" className="mt-4" asChild>
                <Link href="/trips/new">
                    <IconPlus />
                    <span className="ml-2">{t("Create.title")}</span>
                </Link>
            </Button>

            <Suspense fallback={<Loading />}>
                <TripList userid="4e5c65fc-fa9d-4f9e-baee-c4d5914cec93" />
            </Suspense>
        </article>
    )
}
