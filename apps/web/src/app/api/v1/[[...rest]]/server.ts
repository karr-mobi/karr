import { ORPCError, os } from "@orpc/server"
import { cookies, headers } from "next/headers"
import { z } from "zod/v4-mini"
import { isAuthenticated } from "./lib/auth"

export const base = os
    .errors({
        INTERNAL_SERVER_ERROR: {
            message: "Internal server error",
            status: 500,
            data: z.optional(
                z.object({
                    cause: z.string()
                })
            )
        },
        NOT_FOUND: {
            message: "Not found",
            status: 404,
            data: z.optional(
                z.object({
                    cause: z.string()
                })
            )
        }
    })
    .use(async ({ next }) =>
        next({
            context: {
                headers: await headers(),
                cookies: await cookies()
            }
        })
    )
    .use(async ({ next, context }) => {
        const authed = await isAuthenticated(context.cookies)

        if (!authed) {
            throw new ORPCError("UNAUTHORIZED", {
                message: "You are not authorized to access this resource",
                status: 401
            })
        }

        return next({
            context: {
                user: authed
            }
        })
    })
