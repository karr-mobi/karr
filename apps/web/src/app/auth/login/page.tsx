import { Metadata } from "next"

import getAppConfig from "@karr/config"
import { Button } from "@karr/ui/Button"

import { login } from "./login"

export const metadata: Metadata = {
    title: `${getAppConfig().APPLICATION_NAME} Login`
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
                <Button
                    type="submit"
                    className="w-full cursor-pointer rounded-md px-4 py-2 text-xl"
                >
                    Login
                </Button>
            </form>
        </div>
    )
}
