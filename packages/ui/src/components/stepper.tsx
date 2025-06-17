"use client"

import { cn } from "@karr/ui/lib/utils"
import { ChevronRight, CircleCheck } from "lucide-react"
import { motion } from "motion/react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import React, { useCallback, useEffect, useRef, useState } from "react"

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
    submit,
    children,
    className
}: {
    submit?: React.ReactNode
    children: React.ReactNode[]
    className?: string
}) => {
    const p = useSearchParams()

    const t = useTranslations("Utilities")

    const [step, setStep] = useState(Number(p.get("step")) || 1)
    const [isExpanded, setIsExpanded] = useState(true)
    const stepContainerRef = useRef<HTMLDivElement>(null)

    const steps = React.Children.count(children)

    const handleContinue = useCallback(() => {
        if (step < steps) {
            setStep(step + 1)
            setIsExpanded(false)
        }
    }, [step, steps])

    const handleBack = () => {
        if (step === 2) {
            setIsExpanded(true)
        }
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const dots = Array(steps)
        .fill(0)
        .map((_, i) => i)

    // Handle keyboard events
    useEffect(() => {
        //biome-ignore lint/complexity/noExcessiveCognitiveComplexity: it's fine
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" || event.key === "Tab") {
                event.preventDefault()

                // Find the next focusable element within the current step
                if (stepContainerRef.current) {
                    const currentStepElement =
                        stepContainerRef.current.querySelector(
                            `[data-step="${step}"]`
                        )
                    if (currentStepElement) {
                        const focusableElements =
                            currentStepElement.querySelectorAll(
                                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                            )

                        const currentFocused = document.activeElement
                        const currentIndex = Array.from(
                            focusableElements
                        ).indexOf(currentFocused as Element)

                        if (
                            currentIndex >= 0 &&
                            currentIndex < focusableElements.length - 1
                        ) {
                            // Focus next element in current step
                            ;(
                                focusableElements[
                                    currentIndex + 1
                                ] as HTMLElement
                            ).focus()
                            // Focus first element in next step or continue to next step
                        } else if (step < steps) {
                            handleContinue()
                            // After step change, focus first element in new step
                            setTimeout(() => {
                                const nextStepElement =
                                    stepContainerRef.current?.querySelector(
                                        `[data-step="${step + 1}"]`
                                    )
                                if (nextStepElement) {
                                    const nextFocusableElements =
                                        nextStepElement.querySelectorAll(
                                            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                                        )
                                    if (nextFocusableElements.length > 0) {
                                        ;(
                                            nextFocusableElements[0] as HTMLElement
                                        ).focus()
                                    }
                                }
                            }, 100)
                        }
                    }
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [handleContinue, step, steps])

    if (steps === 0) {
        return (
            <div className="rounded-md bg-red-500 p-4 text-white">
                Stepper: No children provided
            </div>
        )
    }

    if (steps > widths.length) {
        return (
            <div className="rounded-md bg-red-500 p-4 text-white">
                Stepper: Too many children provided
            </div>
        )
    }

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-8",
                className
            )}
        >
            <div className="relative flex items-center gap-6">
                {dots.map((dot, index) => (
                    <div
                        key={dot as number}
                        className={cn(
                            "relative z-10 size-2 rounded-full",
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
                    className="-left-[8px] -top-[8px] absolute h-3 rounded-full bg-primary/65"
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
            <div
                className="relative w-full overflow-hidden"
                ref={stepContainerRef}
            >
                <div className="grid grid-cols-1 grid-rows-1">
                    {React.Children.map(children, (child, index) => (
                        <motion.div
                            key={child?.toString()}
                            data-step={index + 1}
                            initial={{ x: index === 0 ? 0 : 300, opacity: 0 }}
                            animate={{
                                x:
                                    index + 1 === step
                                        ? 0
                                        : index + 1 < step
                                          ? -300
                                          : 300,
                                opacity: index + 1 === step ? 1 : 0
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                                mass: 0.8
                            }}
                            style={{
                                gridArea: "1 / 1",
                                padding: "1rem"
                            }}
                        >
                            {child}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Buttons container */}
            <div className="z-4 flex w-[80%] max-w-50 items-end justify-end gap-6">
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
                        <Button type="button" variant="ghost">
                            {t("back")}
                        </Button>
                    </motion.div>
                )}

                {submit && step === steps ? (
                    submit
                ) : (
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

                        <TextMorph>
                            {step === steps ? t("submit") : t("next")}
                        </TextMorph>

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
                )}
            </div>
        </div>
    )
}

export { Stepper }
