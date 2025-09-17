import { isDefinedError, safe } from "@orpc/client"
import { getLocale } from "next-intl/server"
import { redirect } from "@/i18n/routing"
import { client } from "@/lib/orpc"

export async function adminCheck() {
    const { error, data } = await safe(client.admin.check())

    if (isDefinedError(error)) {
        if (error.code === "UNAUTHORIZED") {
            return false
        } else if (error.code === "FORBIDDEN") {
            return redirect({ href: "/login", locale: await getLocale() })
        } else {
            throw error
        }
    } else if (error) {
        throw error
    } else {
        return data === "ok"
    }
}
