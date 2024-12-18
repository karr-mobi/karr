import type { ComponentPropsWithoutRef } from "react"

export default function Loading({
    className = "",
    ...props
}: ComponentPropsWithoutRef<"div">) {
    return (
        <div className="text-white">
            Loading...
            <div
                className={"animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-200" +
                    className}
                {...props}
            />
        </div>
    )
}
