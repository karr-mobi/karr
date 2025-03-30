"use server"

import { cookies } from "next/headers"
import { getLocale } from "next-intl/server"

import { callbackUrl, client } from "@karr/auth/client"
import { subjects } from "@karr/auth/subjects"

import { redirect } from "@/i18n/routing"

import { Tokens } from "@openauthjs/openauth/client"

export async function auth() {
    const jar = await cookies()
    const accessToken = jar.get("access_token")
    const refreshToken = jar.get("refresh_token")

    if (!accessToken) {
        return false
    }

    const verified = await client.verify(subjects, accessToken.value, {
        refresh: refreshToken?.value
    })

    if (verified.err) {
        console.error("Error verifying token:", verified.err)
        return false
    }
    if (verified.tokens) {
        await setTokens(verified.tokens)
    }

    return verified.subject
}

export async function login() {
    const locale = await getLocale()
    const jar = await cookies()
    const accessToken = jar.get("access_token")
    const refreshToken = jar.get("refresh_token")

    if (accessToken) {
        const verified = await client.verify(subjects, accessToken.value, {
            refresh: refreshToken?.value
        })
        if (!verified.err && verified.tokens) {
            await setTokens(verified.tokens)
            redirect({ href: "/", locale })
        }
    }

    const { url } = await client.authorize(callbackUrl, "code")
    redirect({ href: url, locale })
}

export async function logout() {
    const locale = await getLocale()
    const jar = await cookies()
    jar.delete("access_token")
    jar.delete("refresh_token")

    redirect({ href: "/", locale })
}

export async function setTokens(tokens: Tokens) {
    const jar = await cookies()

    jar.set({
        name: "access_token",
        value: tokens.access,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: tokens.expiresIn
    })
    jar.set({
        name: "refresh_token",
        value: tokens.refresh,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 400 // 400 days
    })
}
