import { createSubjects } from "@openauthjs/openauth/subject"
import { z } from "zod"

const user = z.object({
    id: z.string(),
    avatar: z.url().optional(),
    name: z.string()
})

export const subjects = createSubjects({
    user
})

export type UserSubject = z.infer<typeof user>
