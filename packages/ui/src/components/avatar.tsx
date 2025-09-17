"use client"

import { cn } from "@karr/ui/lib/utils"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

const variants = cva(
    "relative flex size-8 shrink-0 overflow-hidden object-cover",
    {
        variants: {
            variant: {
                rounded: "rounded-full",
                square: "aspect-square"
            }
        },
        defaultVariants: {
            variant: "rounded"
        }
    }
)

function Avatar({
    className,
    variant,
    ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> &
    VariantProps<typeof variants>) {
    return (
        <AvatarPrimitive.Root
            data-slot="avatar"
            className={cn(variants({ variant, className }))}
            {...props}
        />
    )
}

function AvatarImage({
    className,
    ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
    return (
        <AvatarPrimitive.Image
            data-slot="avatar-image"
            className={cn("size-full object-cover", className)}
            {...props}
        />
    )
}

function AvatarFallback({
    className,
    ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
    return (
        <AvatarPrimitive.Fallback
            data-slot="avatar-fallback"
            className={cn(
                "flex size-full items-center justify-center rounded-full bg-muted",
                className
            )}
            {...props}
        />
    )
}

export { Avatar, AvatarImage, AvatarFallback }
