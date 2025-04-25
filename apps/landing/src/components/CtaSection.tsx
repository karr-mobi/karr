"use client"

import { motion } from "motion/react"
import { Button } from "@karr/ui/components/button"
import AnimatedSection from "@/components/AnimatedSection"
import { fadeIn, staggerContainer, popIn } from "@/lib/animation-variants"
import { cta } from "@/lib/content"
import Link from "next/link"

export default function CtaSection() {
    return (
        <AnimatedSection
            id="contact"
            className="w-full py-12 md:py-24 lg:py-32"
            variants={fadeIn}
        >
            <div className="container px-4 md:px-6">
                <motion.div
                    className="flex flex-col items-center justify-center space-y-6 text-center"
                    variants={fadeIn}
                >
                    <motion.h2
                        className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                        variants={fadeIn}
                    >
                        {cta.title}
                    </motion.h2>
                    <motion.p
                        className="mx-auto max-w-[700px] text-muted-foreground md:text-lg"
                        variants={fadeIn}
                    >
                        {cta.description}
                    </motion.p>
                    <motion.div
                        className="flex flex-col gap-4 min-[400px]:flex-row"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {cta.ctas.map((cta, index) => (
                            <motion.div
                                key={cta.href}
                                variants={popIn}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    size="lg"
                                    variant={
                                        index === 0 ? "default" : "outline"
                                    }
                                    className="h-12"
                                    asChild
                                >
                                    <Link
                                        {...(cta.href?.startsWith("http") && {
                                            target: "_blank",
                                            rel: "noopener noreferrer"
                                        })}
                                        href={cta.href}
                                    >
                                        {cta.name}
                                    </Link>
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                    <motion.p
                        className="text-sm text-muted-foreground"
                        variants={fadeIn}
                    >
                        {cta.subtext}
                    </motion.p>
                </motion.div>
            </div>
        </AnimatedSection>
    )
}
