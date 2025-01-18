"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { User } from "lucide-react"

import { Button } from "@karr/ui/components/button"

import { getAuthentication } from "@/util/auth"

export default function LoginAccount() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        // Set initial state
        setIsAuthenticated(getAuthentication())

        // Listen for authentication changes
        const handleAuthChange = () => {
            setIsAuthenticated(getAuthentication())
        }

        window.addEventListener("auth-change", handleAuthChange)

        // Cleanup
        return () => {
            window.removeEventListener("auth-change", handleAuthChange)
        }
    }, [])

    return (
        <>
            {isAuthenticated ? (
                <Button asChild>
                    <Link href="/account">
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
