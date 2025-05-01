import { useTranslations } from "next-intl"

export default function Error() {
    const t = useTranslations("Errors.401")

    return (
        <div className="w-full flex flex-1 flex-col items-center justify-center px-4 text-center">
            <h4 className="text-indigo-600 dark:text-indigo-400">
                {t("title")}
            </h4>
            <p className="mt-2 text-sm">{t("message")}</p>
        </div>
    )
}
