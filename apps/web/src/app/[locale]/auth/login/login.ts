"use server"

import { redirect } from "next/navigation"

export async function login(formData: FormData): Promise<never> {
    const email = formData.get("email") as string | null
    const password = formData.get("password") as string | null

    if (!email || !password) {
        throw new Error("Invalid email or password")
    }

    console.log("logging in")
    console.log({ email, password })
    redirect("/search")
}
