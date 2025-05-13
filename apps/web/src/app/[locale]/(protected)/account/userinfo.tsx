"use client"

import type { InferResponseType } from "@karr/api/client"
import { Badge } from "@karr/ui/components/badge"
import { Marquee } from "@karr/ui/components/marquee"
import { useQuery } from "@tanstack/react-query"
import { CheckIcon, OctagonXIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Loading from "@/components/Loading"
import { client } from "@/util/apifetch"

export default function FetchUserData() {
    const { data, isError, isLoading, error } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await client.user.info.$get()
            if (res.status !== 200) {
                throw new Error("Failed to fetch user data", {
                    cause: await res.json()
                })
            }
            return res.json()
        }
    })

    if (isLoading) {
        return <Loading />
    }

    if (isError || !data) {
        console.error("Error loading user data", error)
        return <p>Error loading user data</p>
    }

    return <ShowUserData user={data} />
}

// TODO: add user type
function ShowUserData({
    user
}: {
    user: InferResponseType<typeof client.user.info.$get, 200>
}) {
    const t = useTranslations("auth.Account")

    const hasSpecialStatus = false

    return (
        <>
            <div className="full-width">
                <Marquee
                    numberOfCopies={10}
                    direction="left"
                    speed="fast"
                    className="bg-green-500 py-2 font-bold text-3xl text-white uppercase"
                >
                    You rock, {user.nickname || user.firstName}!
                </Marquee>
            </div>
            <aside className="flex flex-row gap-4">
                {user.verified ? (
                    <Badge variant="default">
                        <CheckIcon aria-hidden="true" />
                        {t("verified")}
                    </Badge>
                ) : (
                    <Badge variant="destructive">
                        <OctagonXIcon aria-hidden="true" />
                        {t("not-verified")}
                    </Badge>
                )}

                {!hasSpecialStatus && (
                    <Badge variant="outline">
                        <p>{user?.bio || t("no-special-status")}</p>
                    </Badge>
                )}
            </aside>
            <section className="flow">
                <div className="flex flex-row gap-6">
                    <b>{t("user-id")}</b>
                    <p>{user.id.split("-")[0]}</p>
                </div>
                <div className="flex flex-row gap-6">
                    <b>{t("email")}</b>
                    <p>{user.email}</p>
                </div>
            </section>
            <details className="mt-12 text-sm">
                <summary className="text-gray-300 dark:text-gray-700">
                    See raw
                </summary>
                <pre>{JSON.stringify(user, null, 2)}</pre>
            </details>
        </>
    )
}
