import { Loading as LoadingIndicator } from "@/components/Loading"

export default function Loading() {
    return (
        <div className="w-full flex flex-1 flex-col items-center justify-center px-4 text-center">
            <LoadingIndicator />
        </div>
    )
}
