import { cn } from "@karr/ui/lib/utils"
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react"
import * as React from "react"
import { Button } from "./button"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

const InputNumber = React.forwardRef<
    HTMLInputElement,
    Omit<
        React.ComponentProps<"input">,
        "value" | "min" | "max" | "onChange"
    > & {
        value: number
        min: number
        max: number
        onChange: (value: number) => void
    }
>(({ className, value, onChange, min, max, ...props }, ref) => {
    function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newValue = Number.parseInt(event.target.value)
        if (!Number.isNaN(newValue)) {
            onChange(newValue)
        }
    }

    function handleIncrDecr(newValue: number) {
        if (min <= newValue && newValue <= max) {
            onChange(newValue)
        }
    }

    return (
        <section className="grid w-fit grid-cols-[min-content_4rem_min-content] gap-2">
            <Button
                type="button"
                onClick={() => handleIncrDecr(value - 1)}
                variant="ghost"
                disabled={value <= min}
            >
                <MinusCircleIcon />
            </Button>
            <Input
                type="number"
                value={value}
                min={min}
                max={max}
                inputMode="numeric"
                className={cn("text-center", className)}
                ref={ref}
                onChange={handleOnChange}
                {...props}
            />
            <Button
                type="button"
                onClick={() => handleIncrDecr(value + 1)}
                variant="ghost"
                disabled={value >= max}
            >
                <PlusCircleIcon />
            </Button>
        </section>
    )
})
InputNumber.displayName = "InputNumber"

export { Input, InputNumber }
