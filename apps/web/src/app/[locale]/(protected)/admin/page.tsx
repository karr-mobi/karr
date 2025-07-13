import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import { APPLICATION_NAME, APP_VERSION } from "@/util/appname"
import { ServerIcon } from "lucide-react"
import { unauthorized } from "next/navigation"
import { Suspense } from "react"
import { auth } from "@/app/auth/actions"
import Loading from "@/components/Loading"
import { InstanceInfo } from "./components/InstanceInfo"
import { UsersList } from "./components/UsersList"

export default async function AdminPage() {
    const user = await auth()
    if (!user || user.role !== "admin") unauthorized()

    return (
        <div className="container mx-auto space-y-6 py-8">
            <h1 className="font-bold text-3xl">Admin Dashboard</h1>

            {/* Instance Information */}
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Instance Name
                        </CardTitle>
                        <ServerIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">
                            {APPLICATION_NAME}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Version {APP_VERSION}
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
