import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import { ServerIcon } from "lucide-react"
import type { Metadata } from "next"
import { unauthorized } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import { auth } from "@/app/auth/actions"
import Loading from "@/components/Loading"
import { APP_VERSION, APPLICATION_NAME } from "@/util/appname"
import { InstanceInfo } from "./components/InstanceInfo"
import { UsersList } from "./components/UsersList"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Admin")

    return {
        title: t("title"),
        description: t("description")
    }
}

export default async function AdminPage() {
    const user = await auth()
    const t = await getTranslations("Admin")

    if (!user || user.role !== "admin") unauthorized()

    return (
        <div className="container mx-auto space-y-6 py-8">
            <h1 className="font-bold text-3xl">{t("title")}</h1>

            {/* Instance Information */}
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            {t("instance-name")}
                        </CardTitle>
                        <ServerIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">
                            {APPLICATION_NAME}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            {t("version")} {APP_VERSION}
                        </p>
                    </CardContent>
                </Card>

                <Suspense fallback={<Loading />}>
                    <InstanceInfo />
                </Suspense>
            </div>

            {/* Users List */}
            <UsersList />
        </div>
    )
}
