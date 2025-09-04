import { z } from "zod/mini"
import {
    selectUserByAccountId,
    selectUserProfileById,
    selectUserTrips,
    updateAvatar,
    updateProfile
} from "@/api/lib/db/users"
import { EditProfileSchema } from "@/db/schemas/profile"
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

const getAvatar = base
    .route({
        method: "GET"
    })
    .input(z.optional(z.uuidv4()))
    .handler(async ({ context, errors, input }) => {
        const user = input
            ? await selectUserProfileById(input)
            : await selectUserByAccountId(context.user)

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

        return {
            avatar: user.value.avatar,
            firstName: user.value.firstName,
            lastName: user.value.lastName,
            nickname: user.value.nickname
        }
    })
    .actionable()
    .callable()

const changeProfile = base
    .route({
        method: "PUT"
    })
    .input(EditProfileSchema)
    .handler(({ context, input }) => {
        updateProfile(context.user, input)
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
    avatar: getAvatar,
    updateProfile: changeProfile,
    updateAvatar: changeAvatar,
    trips: getUserTrips,
    profile: getPublicProfile
}

export default router
