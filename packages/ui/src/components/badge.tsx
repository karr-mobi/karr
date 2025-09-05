import { cn } from "@karr/ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

const badgeVariants = cva(
    "inline-flex items-center justify-center gap-1 rounded-full border px-2 font-medium text-xs leading-normal outline-offset-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground",
                outline: "text-foreground",
                "outline-destructive": "border-destructive text-destructive"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
