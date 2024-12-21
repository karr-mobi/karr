import { Metadata } from "next"

import { APPLICATION_NAME } from "@karr/config"

import { login } from "./login"

export const metadata: Metadata = {
    title: `${APPLICATION_NAME} Login`
}

export default function Login() {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-3xl">Login</h2>
            <form className="flex flex-col gap-5" action={login}>
                <section className="flex flex-col gap-2">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        className="rounded-md border px-3 py-2"
                        required
                    />
                </section>
                <section className="flex flex-col gap-2">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="rounded-md border px-3 py-2"
                        required
                    />
                </section>
                <button
                    type="submit"
                    className="w-full cursor-pointer rounded-md bg-blue-400 px-4 py-2 text-xl"
                >
                    Login
                </button>
            </form>
        </div>
    )
}
