import logger from "@karr/logger"
import { type FetchError, ofetch } from "ofetch"
import type { Trip } from "@/db/schemas/trips"

import type { DataResponse } from "@/lib/types"

export async function getFederatedTrips(): Promise<Trip[]> {
    const trips: Trip[] = []
    try {
        // biome-ignore lint/suspicious/noExplicitAny: just need to ignore this for now
        for await (const target of [] as any[]) {
            const t = await ofetch<DataResponse<Trip[]>>(
                "/api/v1/federation/trips/search",
                {
                    baseURL: target.url,
                    headers: {
                        Cookie: "auth-token=federation"
                    }
                }
            )
            for (const trip of t.data) {
                trip.origin = target.name
                trips.push(trip)
            }
        }
    } catch (error) {
        logger.error(
            "Error fetching trips from federation:",
            (error as FetchError)?.data || error
        )
    }
    return trips
}
