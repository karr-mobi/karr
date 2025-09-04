import { os } from "@orpc/server"
import { cookies, headers } from "next/headers"
import { z } from "zod/mini"
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
        },
        UNAUTHORIZED: {
            message: "You are not authorized to access this resource",
            status: 401,
            data: z.optional(
                z.object({
                    cause: z.string()
                })
            )
        },
        FORBIDDEN: {
            message: "You are not allowed to access this resource",
            status: 403,
            data: z.optional(
                z.object({
                    cause: z.string()
                })
            )
        },
        BAD_REQUEST: {
            message: "Bad request",
            status: 400,
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
    .use(async ({ next, context, errors }) => {
        const authed = await isAuthenticated(context.cookies)

        if (!authed) {
            throw errors.UNAUTHORIZED({
                message: "You are not authorized to access this resource",
                data: {
                    cause: "Invalid access token"
                }
            })
        }

        return next({
            context: {
                user: authed
            }
        })
    })
