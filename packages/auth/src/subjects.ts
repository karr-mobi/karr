import type { Prettify } from "@karr/util"
import { createSubjects } from "@openauthjs/openauth/subject"
import { z } from "zod/v4-mini"

const user = z.discriminatedUnion("provider", [
    // Local Auth
    z.object({
        provider: z.literal("local"),
        remoteId: z.email(),
        email: z.email()
    }),
    // Google Auth
    z.object({
        provider: z.literal("google"),
        remoteId: z.string(),
        email: z.email(),
        emailVerified: z.boolean(),
        avatar: z.optional(z.url()),
        firstName: z.string(),
        lastName: z.string()
    }),
    // OAuth
    z.object({
        provider: z.enum(["github"]),
        remoteId: z.string(),
        email: z.string(),
        emailVerified: z.boolean(),
        avatar: z.optional(z.url()),
        name: z.string()
    })
])

export const subjects = createSubjects({
    user
})

export type UserProperties = z.infer<typeof user>
export type UserSubject = {
    type: "user"
    properties: Prettify<UserProperties>
}

export type LocalUserSubject = Extract<UserProperties, { provider: "local" }>

export type GoogleUserSubject = Extract<UserProperties, { provider: "google" }>

export type GithubUserSubject = Extract<UserProperties, { provider: "github" }>
