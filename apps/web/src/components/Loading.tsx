import { Spinner } from "@karr/ui/components/spinner"

export default function Loading() {
    return (
        <div className="flex flex-row items-center justify-center gap-4">
            <Spinner variant="ring" />
            <p className="text-gray-500">Loading...</p>
        </div>
    )
}
