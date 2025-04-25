"use client"

import Image from "next/image"
import { motion } from "motion/react"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@karr/ui/components/card"
import AnimatedSection from "@/components/AnimatedSection"
import { fadeIn, staggerContainer, popIn } from "@/lib/animation-variants"
import { testimonials } from "@/lib/content"

export default function TestimonialsSection() {
    return (
        <AnimatedSection
            id="testimonials"
            className="w-full py-12 md:py-24 lg:py-32"
            variants={fadeIn}
        >
            <div className="container px-4 md:px-6">
                <motion.div
                    className="flex flex-col items-center justify-center space-y-4 text-center"
                    variants={fadeIn}
                >
                    <div className="space-y-2">
                        <motion.h2
                            className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                            variants={fadeIn}
                        >
                            Trusted by Forward-Thinking Companies
                        </motion.h2>
                        <motion.p
                            className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
                            variants={fadeIn}
                        >
                            See how organizations are transforming their
                            commuting culture with Karr.
                        </motion.p>
                    </div>
                </motion.div>
                <motion.div
                    className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 pt-8"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={popIn}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.2 }
                            }}
                        >
                            <Card className="text-center h-full">
                                <CardHeader>
                                    <motion.div
                                        className="flex justify-center"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: 0.1 * index
                                        }}
                                        viewport={{ once: true }}
                                    >
                                        <Image
                                            src={
                                                testimonial.avatar ||
                                                "/placeholder.svg"
                                            }
                                            alt={testimonial.author}
                                            width={64}
                                            height={64}
                                            className="rounded-full"
                                        />
                                    </motion.div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        "{testimonial.quote}"
                                    </p>
                                </CardContent>
                                <CardFooter className="flex flex-col">
                                    <p className="font-semibold">
                                        {testimonial.author}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {testimonial.role}
                                    </p>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </AnimatedSection>
    )
}
