import { Metadata } from "next"

import getAppConfig from "@karr/config"
import { Button } from "@karr/ui/components/button"

export const metadata: Metadata = {
    title: `${getAppConfig().APPLICATION_NAME} Signup`
}

export default function Signup() {
    return (
        <div className="flex flex-col gap-4">
            <h2>Signup</h2>
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
                    className="text-md w-full cursor-pointer rounded-md px-4 py-2"
                >
                    Sign up
                </Button>
            </form>
        </div>
    )
}
