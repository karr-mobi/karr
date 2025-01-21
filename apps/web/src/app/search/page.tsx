import { Suspense } from "react"

import Loading from "@/components/Loading"
import TripList from "./trips"

export default function Search() {
    return (
        <article className="mt-6">
            <h3>Search for trips</h3>

            <Suspense fallback={<Loading />}>
                <TripList userid="4e5c65fc-fa9d-4f9e-baee-c4d5914cec93" />
            </Suspense>
        </article>
    )
}
