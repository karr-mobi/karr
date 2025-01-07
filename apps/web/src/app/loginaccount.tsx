"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@karr/ui/button"

export default function LoginAccount() {
    const [loggedIn, setLoggedIn] = useState(false)

    return (
        <>
            <Button
                className="inset-shadow-sm inset-shadow-white/20 inset-ring inset-ring-white/15 text-sm ring ring-blue-600"
                onClick={() => {
                    setLoggedIn(!loggedIn)
                }}
            >
                Change login
            </Button>
            {loggedIn ? (
                <>
                    <Link
                        href="/account"
                        className="rounded-sm border px-2 py-1"
                    >
                        Account
                    </Link>
                </>
            ) : (
                <>
                    <Link href="/auth/signup">Sign up</Link>
                    <Link
                        href="/auth/login"
                        className="rounded-sm border px-2 py-1"
                    >
                        Login
                    </Link>
                </>
            )}
        </>
    )
}
