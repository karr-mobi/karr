"use client"

import { motion, type Variants } from "motion/react"
import type React from "react"
import { useInView } from "react-intersection-observer"
import { fadeIn } from "@/lib/animation-variants"

interface AnimatedSectionProps {
    children: React.ReactNode
    className?: string
    variants?: Variants | undefined
    id?: string
}

export default function AnimatedSection({
    children,
    className,
    variants = fadeIn,
    id
}: AnimatedSectionProps) {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    })

    return (
        <motion.section
            id={id}
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={variants}
            className={className}
        >
            {children}
        </motion.section>
    )
}
