//biome-ignore-all lint/correctness/noChildrenProp: need to pass a prop to children

"use client"

import { Button } from "@karr/ui/components/button"
import { Calendar } from "@karr/ui/components/calendar"
import { Input, InputNumber } from "@karr/ui/components/input"
import { Label } from "@karr/ui/components/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@karr/ui/components/popover"
import { toast } from "@karr/ui/components/sonner"
import { Stepper } from "@karr/ui/components/stepper"
import { TextMorph } from "@karr/ui/components/text-morph"
import { cn } from "@karr/ui/lib/utils"
import type { AnyFieldApi } from "@tanstack/react-form"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarDaysIcon, OctagonXIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useTranslations } from "next-intl"
import { use } from "react"
import { NewTripInputSchema } from "@/app/api/v1/db/schemas/trips"
import { useRouter } from "@/i18n/routing"
import { orpc } from "@/lib/orpc"

function FieldInfo({
    field,
    message
}: {
    field: AnyFieldApi
    message?: string
}) {
    return (
        <>
            <AnimatePresence>
                {field.state.meta.isTouched && !field.state.meta.isValid ? (
                    <motion.div
                        className="mt-4 flex flex-row items-center gap-2 rounded-sm border border-destructive bg-destructive/15 px-2 py-1 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                    >
                        <OctagonXIcon className="text-destructive" />
                        {message ||
                            field.state.meta.errors
                                .map((err) => err.message.split(":")[0])
                                .join(",")}
                    </motion.div>
                ) : null}
            </AnimatePresence>
            <AnimatePresence>
                {field.state.meta.isValidating ? (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        Validating...
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    )
}

export function Form({ petrolPrice }: { petrolPrice: Promise<number> }) {
    const avgPetrolPrice = use(petrolPrice)
    const t = useTranslations("trips.Create")
    const router = useRouter()

    const newTripMutation = useMutation(
        orpc.trips.add.mutationOptions({
            onSuccess: () => {
                router.push("/trips/search")
                toast.success(t("added"))
            },
            onError: () => {
                toast.error("Something went wrong")
            }
        })
    )

    const form = useForm({
        defaultValues: {
            from: "",
            to: "",
            departure: new Date(Date.now()).toISOString(),
            // TODO: make this dynamic depending on actual trip distance
            price: Math.round(((40 * 6) / 100) * avgPetrolPrice) // estimated price for 40km, 6 L/100km consumption, using national E10 price average
        },
        validators: {
            //@ts-expect-error: type problem but it's fine, just not infered well
            onChange: NewTripInputSchema
        },
        onSubmit: ({ value }) => {
            void newTripMutation.mutate(value)
        }
    })

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
        >
            <Stepper
                submit={
                    <form.Subscribe
                        selector={(state) => [
                            state.canSubmit,
                            state.isSubmitting
                        ]}
                        children={([canSubmit, isSubmitting]) => (
                            <div className="flex flex-row items-center justify-end gap-2">
                                <Button type="submit" disabled={!canSubmit}>
                                    <TextMorph>
                                        {isSubmitting ? "Sending" : t("create")}
                                    </TextMorph>
                                </Button>
                            </div>
                        )}
                    />
                }
            >
                <div>
                    <form.Field
                        name="from"
                        children={(field) => {
                            return (
                                <>
                                    <Label htmlFor={field.name}>
                                        {t("from")}
                                    </Label>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                    />
                                    <FieldInfo field={field} />
                                </>
                            )
                        }}
                    />
                </div>
                <div>
                    <form.Field
                        name="to"
                        children={(field) => (
                            <>
                                <Label htmlFor={field.name}>{t("to")}</Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                />
                                <FieldInfo field={field} />
                            </>
                        )}
                    />
                </div>
                <div>
                    <form.Field
                        name="departure"
                        children={(field) => (
                            <>
                                <Label htmlFor={field.name}>
                                    {t("departure")}
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.state.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {field.state.value ? (
                                                format(
                                                    field.state.value,
                                                    "dd/MM/yyyy"
                                                )
                                            ) : (
                                                <span>{t("pick-date")}</span>
                                            )}
                                            <CalendarDaysIcon className="ml-auto h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={
                                                new Date(field.state.value)
                                            }
                                            onSelect={(e) =>
                                                field.handleChange(
                                                    e.toISOString()
                                                )
                                            }
                                            required
                                            autoFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FieldInfo field={field} />
                            </>
                        )}
                    />
                </div>
                <div>
                    <form.Field
                        name="price"
                        children={(field) => (
                            <>
                                <Label htmlFor={field.name}>{t("price")}</Label>
                                <InputNumber
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => {
                                        field.handleChange(
                                            Number(e.target.value)
                                        )
                                    }}
                                />
                                <FieldInfo
                                    field={field}
                                    message="Prix trop bas"
                                />
                            </>
                        )}
                    />
                </div>
            </Stepper>
        </form>
    )
}
