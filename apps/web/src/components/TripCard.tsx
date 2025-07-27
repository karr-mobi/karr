import type { Trip } from "@karr/api/db/trips"
import { Avatar, AvatarFallback, AvatarImage } from "@karr/ui/components/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    type CardVariants
} from "@karr/ui/components/card"
import { useDisplayName, useInitials } from "@karr/ui/hooks/users"
import { cn } from "@karr/ui/lib/utils"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/routing"

export function TripCard({
    trip,
    variant,
    size,
    className
}: {
    trip: Trip
    className?: string
} & CardVariants) {
    const locale = useLocale()

    return (
        <Card
            variant={variant}
            size={size}
            className={cn("relative w-full max-w-full md:w-[48%]", className)}
        >
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row items-center justify-between gap-2">
                        <p>
                            {trip.from} – {trip.to}
                        </p>
                    </div>
                </CardTitle>
                <CardDescription>
                    {new Date(trip.departure).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>{trip.price} €</p>
            </CardContent>
            <CardFooter>
                <Link
                    href={`/profile/${trip.driver}`}
                    className="relative z-10 flex items-center justify-start gap-4 hover:underline focus:underline"
                >
                    <Avatar>
                        <AvatarImage src={trip.avatar || ""} />
                        <AvatarFallback>{useInitials(trip)}</AvatarFallback>
                    </Avatar>

                    <p>{useDisplayName(trip)}</p>
                </Link>
            </CardFooter>

            {/* Stretched link for the main card action */}
            <Link
                href={`/trips/${trip.id}`}
                className="absolute inset-0"
                aria-label={`View trip from ${trip.from} to ${trip.to}`}
            >
                <span className="sr-only">View trip details</span>
            </Link>
        </Card>
    )
}
