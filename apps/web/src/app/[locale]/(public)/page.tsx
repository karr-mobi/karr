import { APPLICATION_NAME } from "@karr/config/static"
import { Button } from "@karr/ui/components/button"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { memo } from "react"
import logo from "@/assets/logo-tmp.jpg"
import { Link } from "@/i18n/routing"

const MemoizedAppName = memo(
    () => <h1 className="tracking-tight">{APPLICATION_NAME}</h1>,
    () => true // Never update
)

export default function Home() {
    const t = useTranslations("HomePage")

    return (
        <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <MemoizedAppName />
                    <h6 className="mt-4">{t("slogan")}</h6>
                </div>
                <div className="mt-10 flex flex-col items-center justify-center gap-y-4">
                    <Image
                        src={logo}
                        alt="Karr"
                        width={400}
                        height={400}
                        className="rounded-lg"
                        placeholder="blur"
                    />
                </div>
            </div>
        </div>
    )
}
