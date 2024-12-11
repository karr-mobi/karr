import { Suspense } from "react"
import Button from "@ui/components/Button.tsx"

export default function Home() {
    return (
        <div>
            <h1>Welcome to Karr Auth!</h1>

            <Suspense fallback={<div>Loading...</div>}>
                <Button>
                    Click me!
                </Button>
            </Suspense>
        </div>
    )
}
