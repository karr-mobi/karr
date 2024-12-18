import { Suspense } from "react"
import { Button, Loading } from "@ui/components"

export default function Signup() {
    return (
        <div className="">
            <h1 className="">
            </h1>
            <Loading />

            <Suspense fallback={<Loading />}>
                <Button>
                    Click me!
                </Button>
            </Suspense>
        </div>
    )
}
