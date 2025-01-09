import { ReactNode } from "react"

interface ButtonProps {
    children: ReactNode
    className?: string
    onClick?: () => void
    type?: "submit" | "button"
    wide?: boolean
}

export const Button = ({
    children,
    className,
    onClick,
    type = "button",
    wide = false
}: ButtonProps) => {
    const width = wide ? "w-full" : "w-fit"

    return (
        <button
            className={`inset-shadow-sm inset-shadow-white/20 inset-ring inset-ring-white/15 inline-block ${width} cursor-pointer rounded-lg bg-green-600 px-2 py-1 text-sm text-white ring ring-green-700 ${className}`}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    )
}
