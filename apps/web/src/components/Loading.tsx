export default function Loading() {
    return (
        <div className="flex flex-row items-center justify-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-gray-300"></div>
            <p className="text-gray-500">Loading...</p>
        </div>
    )
}
