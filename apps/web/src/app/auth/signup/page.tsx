import { Metadata } from "next"

import getAppConfig from "@karr/config"
import { Button } from "@karr/ui/Button"

export const metadata: Metadata = {
    title: `${getAppConfig().APPLICATION_NAME} Signup`
}

export default function Signup() {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-3xl">Signup</h2>
            <form
                className="flex flex-col gap-5"
                action={async () => {
                    "use server"

                    console.log("signing up")
                }}
            >
                <section className="flex flex-col gap-2">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        className="rounded-md border px-3 py-2"
                    />
                </section>
                <section className="flex flex-col gap-2">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="rounded-md border px-3 py-2"
                    />
                </section>
                <Button
                    type="submit"
                    className="w-full cursor-pointer rounded-md px-4 py-2 text-xl"
                >
                    Sign up
                </Button>
            </form>
        </div>
    )
}
