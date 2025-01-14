import Image from "next/image"
import Link from "next/link"

import { APPLICATION_NAME } from "@karr/config/static"
import { Button } from "@karr/ui/components/button"

import logo from "@/assets/logo-tmp.jpg"

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="tracking-tight">{APPLICATION_NAME}</h1>
                    <h6 className="mt-4">The federated carpool platform.</h6>
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
                    <Button className="mt-4" asChild>
                        <Link href="https://github.com/finxol/karr" target="_blank">
                            GitHub live
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
