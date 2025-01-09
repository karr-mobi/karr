import { ReactNode } from "react"

interface ButtonProps {
    children: ReactNode
    className?: string
    onClick?: () => void
    type?: "submit" | "button"
}

export const Button = ({
    children,
    className,
    onClick,
    type = "button"
}: ButtonProps) => {
    return (
        <button
            className={`inset-shadow-sm inset-shadow-white/20 inset-ring inset-ring-white/15 cursor-pointer rounded-lg bg-green-600 px-2 py-1 text-sm text-white ring ring-green-700 ${className}`}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    )
}
