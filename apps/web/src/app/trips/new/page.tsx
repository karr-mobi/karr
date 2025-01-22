import { Suspense } from "react"

import Loading from "@/components/Loading"
import NewTripForm from "./newTripForm"

export default function New() {
    return (
        <article className="mt-6">
            <h3>Add new trip</h3>

            <Suspense fallback={<Loading />}>
                <NewTripForm />
            </Suspense>
        </article>
    )
}
