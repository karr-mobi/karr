import { getTranslations } from "next-intl/server"

export const metadata = {
    title: "Login Error",
    description: "Login Error Page"
}

export default async function Login({
    searchParams
}: {
    searchParams: Promise<{ error: string; error_description: string }>
}) {
    const params = await searchParams

    const error = params.error
    const errorDescription = params.error_description

    const t = await getTranslations("auth.Login")

    return (
        <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center">
                {error && (
                    <div className="text-center text-xs text-gray-500">
                        {error}
                    </div>
                )}
                <div className="text-sm text-center gap-4 text-gray-500">
                    {t("error")}
                </div>
                {errorDescription && (
                    <div className="mt-10 text-center">
                        {errorDescription === "Account is blocked"
                            ? t("blocked")
                            : errorDescription}
                    </div>
                )}
            </div>
        </div>
    )
}
