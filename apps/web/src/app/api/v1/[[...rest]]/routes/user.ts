import type { InferRouterInputs } from "@orpc/server"
import { z } from "zod/v4-mini"
import {
    selectUserById,
    selectUserProfileById,
    selectUserTrips,
    updateAvatar,
    updateBio,
    updateNickname
} from "@/api/lib/db/users"
import { base } from "../server"

const userInfo = base
    .handler(async ({ context, errors }) => {
        const user = await selectUserById(context.user.id)

        if (user.isErr()) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to fetch user",
                data: {
                    cause: user.error
                }
            })
        }

        if (!user.value) {
            throw errors.NOT_FOUND({
                message: "User not found"
            })
        }

        return user.value
    })
    .actionable()
    .callable()

type UserInfo = InferRouterInputs<typeof userInfo>

const changeNickname = base
    .input(z.string().check(z.minLength(2)))
    .handler(async ({ context, input: nickname }) => {
        updateNickname(context.user.id, nickname)
    })
    .actionable()
    .callable()

const changeBio = base
    .input(z.string().check(z.minLength(2), z.maxLength(248)))
    .handler(async ({ context, input: bio }) => {
        updateBio(context.user.id, bio)
    })
    .actionable()
    .callable()

const changeAvatar = base
    .input(z.nullable(z.url()))
    .handler(async ({ context, input: avatar }) => {
        updateAvatar(context.user.id, avatar)
    })
    .actionable()
    .callable()

const getUserTrips = base
    .handler(async ({ context, errors }) => {
        const user = await selectUserTrips(context.user.id)

        if (user.isErr()) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to fetch user",
                data: {
                    cause: user.error
                }
            })
        }

        if (!user.value) {
            throw errors.NOT_FOUND({
                message: "User not found"
            })
        }

        return user.value
    })
    .actionable()
    .callable()

/**
 * Get the public profile of a user. Only limited information is available.
 * @param {string} id - The user ID. Must be a valid UUID v4
 */
const getPublicProfile = base
    .input(z.uuidv4())
    .handler(async ({ errors, input }) => {
        const user = await selectUserProfileById(input)

        if (user.isErr()) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: "Failed to fetch profile",
                data: {
                    cause: user.error
                }
            })
        }

        if (!user.value) {
            throw errors.NOT_FOUND({
                message: "User not found"
            })
        }

        return user.value
    })
    .actionable()
    .callable()

export const router = {
    info: userInfo,
    updateNickname: changeNickname,
    updateBio: changeBio,
    updateAvatar: changeAvatar,
    trips: getUserTrips,
    profile: getPublicProfile
}

export default router
