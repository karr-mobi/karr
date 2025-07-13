import type { Prettify } from "@karr/util"
import { createSubjects } from "@openauthjs/openauth/subject"
import { z } from "zod/v4"

const user = z.object({
    id: z.string(),
    avatar: z.url().optional().nullable(),
    firstName: z.string(),
    lastName: z.string(),
    nickname: z.string().nullable(),
    role: z.enum(["user", "admin"])
})

export const subjects = createSubjects({
    user
})

export type UserProperties = z.infer<typeof user>
export type UserSubject = {
    type: "user"
    properties: Prettify<UserProperties>
}
