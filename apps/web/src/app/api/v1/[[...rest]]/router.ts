import * as z from "zod"
import userRouter from "./routes/user"
import { base } from "./server"

const PlanetSchema = z.object({
    id: z.number().int().min(1),
    name: z.string(),
    description: z.string().optional()
})

export const listPlanet = base
    .input(
        z.object({
            limit: z.number().int().min(1).max(100).optional(),
            cursor: z.number().int().min(0).default(0)
        })
    )
    .handler(async ({ input, context }) => {
        const { headers, cookies } = context

        console.log(cookies.get("access_token"))

        // your list code here
        return [
            { id: 1, name: "name" },
            { id: 2, name: "name2" },
            { id: 3, name: "name3" },
            { id: 4, name: "name4" }
        ]
    })
    .callable()

export const findPlanet = base
    .input(PlanetSchema.pick({ id: true }))
    .handler(async ({ input }) => {
        // your find code here
        return { id: 1, name: "name" }
    })

export const createPlanet = base
    .input(PlanetSchema.omit({ id: true }))
    .handler(async ({ input, context }) => {
        // your create code here
        return { id: 1, name: "name" }
    })

export const router = {
    planet: {
        list: listPlanet,
        find: findPlanet,
        create: createPlanet
    },
    user: userRouter
}
