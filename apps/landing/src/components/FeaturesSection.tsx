"use client"

import { motion } from "motion/react"
import AnimatedSection from "@/components/AnimatedSection"
import { fadeIn, staggerContainer, popIn } from "@/lib/animation-variants"
import { features } from "@/lib/content"

export default function FeaturesSection() {
    return (
        <AnimatedSection
            id="features"
            className="w-full py-12 md:py-24 lg:py-32 bg-muted"
            variants={fadeIn}
        >
            <div className="container px-4 md:px-6">
                <motion.div
                    className="flex flex-col items-center justify-center space-y-4 text-center"
                    variants={fadeIn}
                >
                    <div className="space-y-8">
                        <motion.h2
                            className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                            variants={fadeIn}
                        >
                            {features.title}
                        </motion.h2>
                        <motion.p
                            className="mx-auto max-w-[700px] text-muted-foreground md:text-lg"
                            variants={fadeIn}
                        >
                            {features.description}
                        </motion.p>
                    </div>
                </motion.div>
                <motion.div
                    className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 pt-8"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {features.features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col items-center space-y-6 rounded-lg p-4 text-center"
                            variants={popIn}
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                transition: { duration: 0.2 }
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -30 }}
                                whileInView={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1 * index
                                }}
                                viewport={{ once: true }}
                            >
                                {
                                    <feature.icon className="h-12 w-12 text-emerald-500" />
                                }
                            </motion.div>
                            <h4 className="text-xl/8 font-bold tracking-tight">
                                {feature.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </AnimatedSection>
    )
}
