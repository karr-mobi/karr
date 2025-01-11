"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@karr/ui/button"

export default function LoginAccount() {
    const [loggedIn, setLoggedIn] = useState(false)

    return (
        <>
            <Button
                onClick={() => {
                    setLoggedIn(!loggedIn)
                }}
            >
                Change login
            </Button>
            {loggedIn ? (
                <>
                    <Link href="/account" className="rounded-sm border px-2 py-1">
                        Account
                    </Link>
                </>
            ) : (
                <>
                    <Link href="/auth/signup">Sign up</Link>
                    <Link href="/auth/login" className="rounded-sm border px-2 py-1">
                        Login
                    </Link>
                </>
            )}
        </>
    )
}
