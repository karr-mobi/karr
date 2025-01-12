import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/logo-tmp.jpg"
import EditConfig from "@/components/EditConfig"

import getAppConfig from "@karr/config"
import { Button } from "@karr/ui/components/button"

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="font-mono text-4xl font-black tracking-tight sm:text-6xl">
                        {getAppConfig().APPLICATION_NAME}
                    </h1>
                    <p className="mt-4 font-mono text-lg">
                        The federated carpool platform.
                    </p>
                </div>
                <div className="mt-10 flex flex-col items-center justify-center gap-y-4">
                    <Image
                        src={logo}
                        alt="Karr"
                        width={400}
                        height={400}
                        className="rounded-lg"
                    />
                    <Button className="mt-4">
                        <Link href="https://github.com/finxol/karr" target="_blank">
                            GitHub live
                        </Link>
                    </Button>
                </div>
            </div>

            <EditConfig />
        </div>
    )
}
