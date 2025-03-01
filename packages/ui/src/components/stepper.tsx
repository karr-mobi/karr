"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight, CircleCheck } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@karr/ui/lib/utils"

import { Button } from "./button"
import { TextMorph } from "./text-morph"

const widths = [
    "12px",
    "24px",
    "60px",
    "96px",
    "128px",
    "160px",
    "192px",
    "224px",
    "256px",
    "288px",
    "320px",
    "352px",
    "384px",
    "416px",
    "448px",
    "480px",
    "512px",
    "544px",
    "576px",
    "608px",
    "640px",
    "672px",
    "704px",
    "736px",
    "768px"
]

const Stepper = ({
    children,
    className
}: {
    children: React.ReactNode[]
    className?: string
}) => {
    const t = useTranslations("Utilities")

    const [step, setStep] = useState(1)
    const [isExpanded, setIsExpanded] = useState(true)

    const steps = React.Children.count(children)

    if (steps === 0) {
        return (
            <div className="bg-red-500 text-white p-4 rounded-md">
                Stepper: No children provided
            </div>
        )
    }

    if (steps > widths.length) {
        return (
            <div className="bg-red-500 text-white p-4 rounded-md">
                Stepper: Too many children provided
            </div>
        )
    }

    const handleContinue = () => {
        if (step < steps) {
            setStep(step + 1)
            setIsExpanded(false)
        }
    }

    const handleBack = () => {
        if (step == 2) {
            setIsExpanded(true)
        }
        if (step > 1) {
            setStep(step - 1)
        }
    }

    return (
        <div className={cn("flex flex-col items-center justify-center gap-8", className)}>
            <div className="flex items-center gap-6 relative">
                {Array.from({ length: steps }).map((_dot: unknown, index: number) => (
                    <div
                        key={index}
                        className={cn(
                            "size-2 rounded-full relative z-10",
                            index < step ? "bg-white" : "bg-gray-300"
                        )}
                    />
                ))}

                {/* Green progress overlay */}
                <motion.div
                    initial={{ width: "12px", height: "24px", x: 0 }}
                    animate={{
                        width: widths[step],
                        x: 0
                    }}
                    className="absolute -left-[8px] -top-[8px] h-3 bg-primary/65 rounded-full"
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        mass: 0.8,
                        bounce: 0.25,
                        duration: 0.6
                    }}
                />
            </div>

            {/* Content */}
            <div className="w-full relative overflow-hidden">
                <div className="grid grid-cols-1 grid-rows-1">
                    {React.Children.map(children, (child, index) => (
                        <motion.div
                            key={index}
                            initial={{ x: index === 0 ? 0 : 300, opacity: 0 }}
                            animate={{
                                x: index + 1 === step ? 0 : index + 1 < step ? -300 : 300,
                                opacity: index + 1 === step ? 1 : 0
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                                mass: 0.8
                            }}
                            style={{
                                gridArea: "1 / 1"
                            }}
                        >
                            {child}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Buttons container */}
            <div className="w-[80%] max-w-50 flex items-end gap-6 justify-end z-4">
                {!isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, width: 0, scale: 0.8 }}
                        animate={{ opacity: 1, width: "64px", scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                            mass: 0.8,
                            bounce: 0.25,
                            duration: 0.6,
                            opacity: { duration: 0.2 }
                        }}
                        onClick={handleBack}
                    >
                        <Button variant="ghost">{t("back")}</Button>
                    </motion.div>
                )}

                <Button onClick={handleContinue}>
                    {/* Completed step icon */}
                    {step === steps && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 15,
                                mass: 0.5,
                                bounce: 0.4
                            }}
                        >
                            <CircleCheck size={16} />
                        </motion.div>
                    )}

                    <TextMorph>{step === steps ? t("submit") : t("next")}</TextMorph>

                    {/* Next step icon */}
                    {step !== steps && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 15,
                                mass: 0.5,
                                bounce: 0.4
                            }}
                        >
                            <ChevronRight size={16} />
                        </motion.div>
                    )}
                </Button>
            </div>
        </div>
    )
}

export { Stepper }
