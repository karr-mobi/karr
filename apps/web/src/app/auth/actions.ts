"use server"

import { getCallbackUrl, getClient } from "@karr/auth/client"
import { subjects } from "@karr/auth/subjects"
import type { Tokens } from "@openauthjs/openauth/client"
import { cookies } from "next/headers"
import { getLocale } from "next-intl/server"

import { redirect } from "@/i18n/routing"

export async function auth() {
    const jar = await cookies()
    const accessToken = jar.get("access_token")
    const refreshToken = jar.get("refresh_token")

    const client = await getClient()

    if (!accessToken) {
        return false
    }

    const verified = await client.verify(subjects, accessToken.value, {
        refresh: refreshToken?.value
    })

    if (verified.err) {
        console.log("Invalid token:", verified.err)
        return false
    }

    return verified.subject.properties
}

export async function login(next: string | FormData = "/") {
    let returnTo: string
    // If returnTo is a FormData object, extract the value from it
    if (next instanceof FormData) {
        returnTo = next.get("returnTo") as string
    } else {
        returnTo = next
    }

    const locale = await getLocale()
    const jar = await cookies()
    const accessToken = jar.get("access_token")
    const refreshToken = jar.get("refresh_token")

    const client = await getClient()
    const callbackUrl = await getCallbackUrl()

    if (accessToken) {
        const verified = await client.verify(subjects, accessToken.value, {
            refresh: refreshToken?.value
        })
        if (!verified.err && verified.tokens) {
            redirect({ href: returnTo, locale })
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
