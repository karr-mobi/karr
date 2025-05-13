"use client"

import { Badge } from "@karr/ui/components/badge"
import { Button } from "@karr/ui/components/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@karr/ui/components/card"
import { CheckCircle2 } from "lucide-react"
import { motion } from "motion/react"
import AnimatedSection from "@/components/AnimatedSection"
import { fadeIn, popIn, staggerContainer } from "@/lib/animation-variants"
import { plans } from "@/lib/content"

export default function PricingSection() {
    return (
        <AnimatedSection
            id="pricing"
            className="w-full bg-muted py-12 md:py-24 lg:py-32"
            variants={fadeIn}
        >
            <div className="container px-4 md:px-6">
                <motion.div
                    className="flex flex-col items-center justify-center space-y-4 text-center"
                    variants={fadeIn}
                >
                    <div className="space-y-2">
                        <motion.h2
                            className="font-bold text-3xl tracking-tighter md:text-4xl/tight"
                            variants={fadeIn}
                        >
                            Simple, Transparent Pricing
                        </motion.h2>
                        <motion.p
                            className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
                            variants={fadeIn}
                        >
                            Choose the plan that fits your company size and
                            needs. All plans include a 30-day free trial.
                        </motion.p>
                    </div>
                </motion.div>
                <motion.div
                    className="mx-auto grid max-w-5xl grid-cols-1 gap-6 pt-8 md:grid-cols-3 lg:gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.name}
                            variants={popIn}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.2 }
                            }}
                        >
                            <Card
                                className={`flex h-full flex-col ${plan.popular ? "border-emerald-500 shadow-lg" : ""}`}
                            >
                                <CardHeader>
                                    {plan.popular && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20
                                            }}
                                        >
                                            <Badge className="mb-2 self-start">
                                                Most Popular
                                            </Badge>
                                        </motion.div>
                                    )}
                                    <CardTitle>{plan.name}</CardTitle>
                                    <div className="flex items-baseline">
                                        <span className="font-bold text-3xl">
                                            {plan.price}
                                        </span>
                                        {plan.price !== "Custom" && (
                                            <span className="text-muted-foreground">
                                                /month
                                            </span>
                                        )}
                                    </div>
                                    <CardDescription>
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <ul className="space-y-2">
                                        {plan.features.map((feature, i) => (
                                            <motion.li
                                                key={feature}
                                                className="flex items-center"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    x: 0
                                                }}
                                                transition={{
                                                    delay: 0.1 * i,
                                                    duration: 0.4
                                                }}
                                                viewport={{ once: true }}
                                            >
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                                                <span>{feature}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <motion.div
                                        className="w-full"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            className="w-full"
                                            variant={
                                                plan.popular
                                                    ? "default"
                                                    : "outline"
                                            }
                                        >
                                            {plan.price === "Custom"
                                                ? "Contact Sales"
                                                : "Start Free Trial"}
                                        </Button>
                                    </motion.div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </AnimatedSection>
    )
}
