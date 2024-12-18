import type { ComponentPropsWithoutRef } from "react"

type ButtonProps = ComponentPropsWithoutRef<"button"> & { href?: undefined }

export default async function Button({
    className = "",
    children,
    ...props
}: ButtonProps) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return (
        <button
            className={"text-white font-bold py-2 px-4 rounded" +
                className}
            onClick={async () => {
                "use server"

                console.log("this is on the server!")
            }}
            type="button"
            {...props}
        >
            {children}
        </button>
    )
}
