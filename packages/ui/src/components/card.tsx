import { cn } from "@karr/ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const cardVariants = cva("rounded-xl", {
    variants: {
        variant: {
            default: "shadow",
            flat: "rounded-lg border p-4"
        },
        size: {
            xs: "px-4 py-2 text-sm",
            sm: "p-4",
            lg: "p-6"
        },
        type: {
            default: "border-border bg-card text-card-foreground",
            error: "border-red-500 bg-red-50 text-red-900"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "lg",
        type: "default"
    }
})

export type CardVariants = VariantProps<typeof cardVariants>

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        CardVariants {
    asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, size, type, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardVariants({ variant, size, type, className }))}
            {...props}
        />
    )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 pb-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-muted-foreground text-sm", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center pt-6", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
