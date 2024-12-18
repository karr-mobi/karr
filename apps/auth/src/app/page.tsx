"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getApplicationName } from "~/lib/config.ts"

export default function Home() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [appName, setAppName] = useState("Karr")

    useEffect(() => {
        getApplicationName().then((name: string) => {
            setAppName(name)
        })
    }, [])

    const loggedIn = false
    if (!loggedIn) {
        router.push("login")
        return
    }

    if (searchParams.get("redirect_url")) {
        //deno-lint-ignore no-non-null-assertion -- we know it's not null from the if statement
        router.replace(searchParams.get("redirect_url")!)
    } else {
        return (
            <div>
                <h1>{appName} Auth dashboard</h1>
                <p>Welcome to the dashboard!</p>
            </div>
        )
    }
}
