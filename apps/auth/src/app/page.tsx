import { Suspense } from "react"
import { Button, Loading } from "@ui/components"

export default function Home() {
    return (
        <div>
            <h1>Welcome to Karr Auth!</h1>
            <Loading />

            <Suspense fallback={<Loading />}>
                <Button>
                    Click me!
                </Button>
            </Suspense>
        </div>
    )
}
