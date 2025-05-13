"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type NewTripInput, NewTripInputSchema } from "@karr/api/db/trips"
import { Button } from "@karr/ui/components/button"
import { Calendar } from "@karr/ui/components/calendar"
import { CurrencyInput } from "@karr/ui/components/currencyInput"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@karr/ui/components/form"
import { Input } from "@karr/ui/components/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@karr/ui/components/popover"
import { toast } from "@karr/ui/components/sonner"
import { cn } from "@karr/ui/lib/utils"
import { tryCatch } from "@karr/util"
import { format } from "date-fns"
import { CalendarDays as IconCalendarDays } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "@/i18n/routing"
import { client } from "@/util/apifetch"

export default function NewTripForm() {
    const t = useTranslations("trips.Create")
    const router = useRouter()

    // Add this state to control client-side rendering
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const form = useForm<NewTripInput>({
        resolver: zodResolver(NewTripInputSchema),
        defaultValues: {
            departure: new Date(Date.now()).toISOString(),
            from: "",
            to: "",
            price: 6
        },
        mode: "onSubmit"
    })

    const onSubmit = async (data: NewTripInput) => {
        const res = await tryCatch(
            client.trips.add.$post({
                json: {
                    ...data
                }
            })
        )
        if (res.success && res.value.status === 200) {
            toast.success(t("added"))
            router.push("/trips/search")
        } else {
            toast.error("Something went wrong")
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("from")}</FormLabel>
                            <FormControl>
                                <Input placeholder="Vannes" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage>
                                {form.formState.errors.from?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("to")}</FormLabel>
                            <FormControl>
                                <Input placeholder="Rennes" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage>
                                {form.formState.errors.to?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="departure"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>{t("departure")}</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {mounted && field.value ? (
                                                format(
                                                    field.value,
                                                    "dd/MM/yyyy"
                                                )
                                            ) : (
                                                <span>{t("pick-date")}</span>
                                            )}
                                            <IconCalendarDays className="ml-auto h-4 w-4" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        mode="single"
                                        selected={new Date(field.value)}
                                        onSelect={field.onChange}
                                        autoFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage>
                                {form.formState.errors.departure?.message}
                            </FormMessage>
                            <FormDescription />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("price")}</FormLabel>
                            <FormControl>
                                <div>
                                    <CurrencyInput
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage>
                                {form.formState.errors.price?.message}
                            </FormMessage>
                            <FormDescription />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="mt-3">
                    {t("create")}
                </Button>
            </form>
        </Form>
    )
}
