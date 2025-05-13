import { cn } from "@karr/ui/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"

import "./marquee.css"

export type MarqueeProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode
    direction?: "left" | "up"
    pauseOnHover?: boolean
    reverse?: boolean
    fade?: boolean
    innerClassName?: string
    numberOfCopies?: number
    speed?: "slow" | "normal" | "fast"
}

export function Marquee({
    children,
    direction = "left",
    pauseOnHover = false,
    reverse = false,
    fade = false,
    className,
    innerClassName,
    numberOfCopies = 2,
    speed = "normal",
    ...rest
}: MarqueeProps) {
    const copies = Array(numberOfCopies)
        .fill(0)
        .map((_, i) => i)
    return (
        <div
            className={cn(
                "group flex max-w-[100vw] gap-[1rem] overflow-hidden",
                direction === "left" ? "flex-row" : "flex-col",
                className
            )}
            style={{
                maskImage: fade
                    ? `linear-gradient(${
                          direction === "left" ? "to right" : "to bottom"
                      }, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
                    : undefined,
                WebkitMaskImage: fade
                    ? `linear-gradient(${
                          direction === "left" ? "to right" : "to bottom"
                      }, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
                    : undefined
            }}
            {...rest}
        >
            {copies.map((i) => (
                <div
                    key={i}
                    className={cn(
                        "flex shrink-0 justify-around gap-[1rem] [--gap:1rem]",
                        direction === "left"
                            ? "animate-marquee-left flex-row"
                            : "animate-marquee-up flex-col",
                        pauseOnHover &&
                            "group-hover:[animation-play-state:paused]",
                        reverse && "direction-reverse",
                        speed === "slow" && "[--duration:20s]",
                        speed === "normal" && "[--duration:10s]",
                        speed === "fast" && "[--duration:5s]",
                        innerClassName
                    )}
                >
                    {children}
                </div>
            ))}
        </div>
    )
}
