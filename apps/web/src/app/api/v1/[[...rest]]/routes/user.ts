import { z } from "zod/v4-mini"
import {
    selectUserByAccountId,
    selectUserProfileById,
    selectUserTrips,
    updateAvatar,
    updateBio,
    updateNickname
} from "@/api/lib/db/users"
import { base } from "../server"

const userInfo = base
    .route({
        method: "GET"
    })
    .handler(async ({ context, errors }) => {
        const user = await selectUserByAccountId(context.user)

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

const changeNickname = base
    .route({
        method: "PUT"
    })
    .input(z.string().check(z.minLength(2)))
    .handler(({ context, input: nickname }) => {
        updateNickname(context.user, nickname)
    })
    .actionable()
    .callable()

const changeBio = base
    .route({
        method: "PUT"
    })
    .input(z.string().check(z.minLength(2), z.maxLength(248)))
    .handler(({ context, input: bio }) => {
        updateBio(context.user, bio)
    })
    .actionable()
    .callable()

const changeAvatar = base
    .route({
        method: "PUT"
    })
    .input(z.nullable(z.url()))
    .handler(({ context, input: avatar }) => {
        updateAvatar(context.user, avatar)
    })
    .actionable()
    .callable()

const getUserTrips = base
    .route({
        method: "GET"
    })
    .handler(async ({ context, errors }) => {
        const user = await selectUserTrips(context.user)

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
    .route({
        method: "GET"
    })
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
