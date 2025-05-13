import { Loading as LoadingIndicator } from "@/components/Loading"

export default function Loading() {
    return (
        <div className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
            <LoadingIndicator />
        </div>
    )
}
