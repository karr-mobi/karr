import { Hono } from "hono"
import { z } from "zod/v4"
import {
    selectUserById,
    selectUserProfileById,
    selectUserTrips,
    updateNickname
} from "@/lib/db/users"
import { handleRequest } from "@/lib/helpers"
import type { AppVariables, ErrorResponse } from "@/lib/types.d.ts"
import { getUserSub } from "@/util/subject"

const NicknameSchema = z.string().min(2)

const hono = new Hono<{ Variables: AppVariables }>()

    // ==============================================
    // ========== Register endpoint routes ==========
    // ==============================================

    /**
     * Get logged in user's info
     * @returns Object containing user info
     */
    .get("/info", async (c) => {
        const subject = getUserSub(c)

        if (!subject) {
            return c.json(
                {
                    message: "User subject missing in context"
                } satisfies ErrorResponse,
                500
            )
        }

        const user = await selectUserById(subject.id)

        if (user.isErr()) {
            return c.json(
                {
                    message: user.error
                } satisfies ErrorResponse,
                500
            )
        }

        if (!user.value) {
            return c.json(
                {
                    message: "User not found"
                } satisfies ErrorResponse,
                404
            )
        }

        return c.json(user.value, 200)
    })

    /**
     * Change the logged in user's nickname
     * @returns {Response} Data response if update was successful, ErrorResponse if not
     */
    .put("/nickname", async (c) => {
        const subject = getUserSub(c)

        if (!subject) {
            return c.json(
                {
                    message: "User subject missing in context"
                } satisfies ErrorResponse,
                500
            )
        }

        const { nickname } = await c.req.json()

        const parsedNickname = NicknameSchema.safeParse(nickname)

        // check the nickname is a valid string
        if (!parsedNickname.success) {
            return c.json(
                {
                    message: "Invalid nickname"
                } satisfies ErrorResponse,
                400
            )
        }

        // update the user's nickname in the database
        return await handleRequest<boolean>(c, () =>
            updateNickname(subject.id, parsedNickname.data)
        )
    })

    /**
     * Get complete list of logged in user's trips
     */
    .get("/trips", async (c) => {
        const subject = getUserSub(c)

        if (!subject) {
            return c.json(
                {
                    message: "User subject missing in context"
                } satisfies ErrorResponse,
                500
            )
        }

        const user = await selectUserTrips(subject.id)

        if (user.isErr()) {
            return c.json(
                {
                    message: user.error
                } satisfies ErrorResponse,
                500
            )
        }

        if (!user.value) {
            return c.json(
                {
                    message: "User not found"
                } satisfies ErrorResponse,
                404
            )
        }

        return c.json(user.value, 200)
    })

    /**
     * Get the public profile of a user. Only limited information is available.
     * @param {string} id - The user ID. Must be a valid UUID v4
     * @returns {Response} DataResponse if fetch was successful, ErrorResponse if not
     */
    .get(
        "/profile/:id{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}}",
        async (c) => {
            const id = c.req.param("id")

            const profile = await selectUserProfileById(id)

            if (profile.isErr()) {
                return c.json(
                    {
                        message: profile.error
                    } satisfies ErrorResponse,
                    500
                )
            }

            if (!profile.value) {
                return c.json(
                    {
                        message: "Profile not found"
                    } satisfies ErrorResponse,
                    404
                )
            }

            return c.json(profile.value, 200)
        }
    )

export default hono
