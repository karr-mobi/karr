"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@karr/ui/components/button"

import { apiFetch } from "@/util/apifetch"
import { setAuthentication } from "@/util/auth"

type Inputs = {
    email: string
    password: string
}

export default function Login() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>()

    const onSubmit = handleSubmit(async (data: Inputs) => {
        console.debug("submit form", data)
        try {
            await apiFetch("/auth/login", {
                method: "POST",
                body: { email: data.email, password: data.password }
            })
            setAuthentication(true)
            router.push("/search")
        } catch (e) {
            console.log(e)
            setError("Invalid email or password")
        }
    })

    return (
        <div className="flex flex-col gap-4">
            <h2>Login</h2>
            <form className="flex flex-col gap-5" onSubmit={onSubmit}>
                <section className="flex flex-col gap-2">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        className="rounded-md border px-3 py-2"
                        {...register("email", { required: true })}
                    />
                </section>
                {errors.email && (
                    <p className="rounded-md border border-red-600 bg-red-100 px-2 py-1">
                        Username is required
                    </p>
                )}
                <section className="flex flex-col gap-2">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="rounded-md border px-3 py-2"
                        {...register("password", { required: true })}
                    />
                </section>
                {errors.password && (
                    <p className="rounded-md border border-red-600 bg-red-100 px-2 py-1">
                        Password is required
                    </p>
                )}
                <Button
                    type="submit"
                    className="text-md w-full cursor-pointer rounded-md px-4 py-2"
                >
                    Login
                </Button>
                {error && (
                    <p className="rounded-md border border-red-600 bg-red-100 px-2 py-1 text-black dark:bg-red-400/50 dark:text-white">
                        {error}
                    </p>
                )}
            </form>
        </div>
    )
}
