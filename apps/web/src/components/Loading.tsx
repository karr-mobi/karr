export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
            <p className="text-gray-500">Loading...</p>
        </div>
    )
}
