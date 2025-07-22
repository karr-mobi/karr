import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import Loading from "@/components/Loading"
import ProfileInfo from "./profileinfo"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Profile")

    return {
        title: t("title"),
        description: t("description")
    }
}

export default async function ProfilePage({
    params
}: {
    params: Promise<{ id: string; locale: string }>
}) {
    const { id } = await params

    // Validate UUID format
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
        notFound()
    }

    return (
        <div className="container mx-auto py-8">
            <Suspense fallback={<Loading />}>
                <ProfileInfo userId={id} />
            </Suspense>
        </div>
    )
}
