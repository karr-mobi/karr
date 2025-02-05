"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarDays as IconCalendarDays } from "lucide-react"
import { useForm } from "react-hook-form"

import { NewTripInputSchema, type NewTripInput } from "@karr/db/schemas/trips.js"
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
import { Popover, PopoverContent, PopoverTrigger } from "@karr/ui/components/popover"
import { toast } from "@karr/ui/components/sonner"
import { cn } from "@karr/ui/lib/utils"

import { useRouter } from "@/i18n/routing"
import { apiFetch } from "@/util/apifetch"

export default function NewTripForm() {
    const router = useRouter()

    const form = useForm<NewTripInput>({
        resolver: zodResolver(NewTripInputSchema),
        defaultValues: {
            departure: new Date(Date.now()),
            from: "",
            to: "",
            price: 6
        },
        mode: "onSubmit"
    })

    const onSubmit = async (data: NewTripInput) => {
        console.log("Submitting...")

        try {
            const _res = await apiFetch("/trips/add", {
                method: "POST",
                body: data
            })
            toast.success("Trip added!")

            router.push("/trips/search")
        } catch (err) {
            console.error(err)
            toast.error("Something went wrong")
            return
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
                            <FormLabel>From</FormLabel>
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
                            <FormLabel>To</FormLabel>
                            <FormControl>
                                <Input placeholder="Rennes" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage>{form.formState.errors.to?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="departure"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Departure</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "pl-3 text-left font-normal w-full",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "dd/MM/yyyy")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <IconCalendarDays className="ml-auto w-4 h-4" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
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
                            <FormLabel>Price (per passenger)</FormLabel>
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
                    Create new trip
                </Button>
            </form>
        </Form>
    )
}
