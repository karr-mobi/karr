"use client"

import { useState } from "react"
import Link from "next/link"
import { RefreshCw, User } from "lucide-react"

import { Button } from "@karr/ui/components/button"

export default function LoginAccount() {
    const [loggedIn, setLoggedIn] = useState(false)

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                onClick={() => {
                    setLoggedIn(!loggedIn)
                }}
            >
                <RefreshCw />
            </Button>
            {loggedIn ? (
                <Button asChild>
                    <Link href="/account" className="rounded-sm border px-2 py-1">
                        <User />
                        Account
                    </Link>
                </Button>
            ) : (
                <>
                    <Button asChild variant="secondary">
                        <Link href="/auth/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/auth/signup">Sign up</Link>
                    </Button>
                </>
            )}
        </>
    )
}
