"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { SquareArrowOutUpRight } from "lucide-react"
import { Button } from "@karr/ui/components/button"
import { Badge } from "@karr/ui/components/badge"
import AnimatedSection from "@/components/AnimatedSection"
import { slideInLeft, slideInRight } from "@/lib/animation-variants"
import screenshot from "@/assets/karr_demo.jpg"
import { hero } from "@/lib/content"

export default function HeroSection() {
    return (
        <AnimatedSection
            className="w-full overflow-x-clip py-12 md:py-24 lg:py-32 xl:py-48"
            id="hero"
        >
            <div className="container px-4 md:px-6 w-full">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                    <motion.div
                        className="flex flex-col justify-center space-y-4"
                        variants={slideInLeft}
                    >
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <Badge className="inline-flex">
                                    {hero.badge}
                                </Badge>
                            </motion.div>
                            <motion.h1
                                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                {hero.title}
                            </motion.h1>
                            <motion.p
                                className="max-w-[600px] text-muted-foreground md:text-lg/tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                {hero.description}
                            </motion.p>
                        </div>
                        <motion.div
                            className="flex flex-col gap-4 min-[400px]:flex-row"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            {hero.ctas.map((cta, index) => (
                                <motion.div
                                    key={cta.name}
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
                                            {...(cta.href?.startsWith(
                                                "http"
                                            ) && {
                                                target: "_blank",
                                                rel: "noopener noreferrer"
                                            })}
                                            href={cta.href}
                                        >
                                            {cta.name}
                                            {cta.href?.startsWith("http") && (
                                                <SquareArrowOutUpRight className="ml-1 h-4 w-4" />
                                            )}
                                        </Link>
                                    </Button>
                                </motion.div>
                            ))}
                        </motion.div>
                        <motion.p
                            className="text-xs text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            {hero.subtext}
                        </motion.p>
                    </motion.div>
                    <motion.div
                        className="relative flex items-center justify-center lg:justify-end w-[50vw] right-[33%] -z-10"
                        variants={slideInRight}
                    >
                        <motion.div
                            className="rounded-xl shadow-xl lg:translate-x-[10%]"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                delay: 0.3,
                                duration: 0.6,
                                type: "spring"
                            }}
                            whileHover={{
                                scale: 1.03
                            }}
                        >
                            <Image
                                src={screenshot}
                                alt="Product Screenshot"
                                width={750}
                                height={450}
                                className="rounded-xl object-cover"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </AnimatedSection>
    )
}
