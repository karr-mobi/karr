import { ReactNode } from "react"

interface ButtonProps {
    children: ReactNode
    className?: string
    onClick?: () => void
}

export const Button = ({ children, className, onClick }: ButtonProps) => {
    return (
        <button
            className={`rounded-xl bg-blue-500 px-2 py-1 text-white ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
