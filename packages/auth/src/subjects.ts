import { Prettify } from "@karr/util"
import { createSubjects } from "@openauthjs/openauth/subject"
import { z } from "zod"

const user = z.object({
    id: z.string(),
    avatar: z.url().optional().nullable(),
    firstName: z.string(),
    lastName: z.string()
})

export const subjects = createSubjects({
    user
})

export type UserProperties = z.infer<typeof user>
export type UserSubject = {
    type: "user"
    properties: Prettify<UserProperties>
}
