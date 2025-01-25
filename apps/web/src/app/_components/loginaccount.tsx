"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { User as IconUser } from "lucide-react"

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
                        <IconUser />
                        <span className="hidden sm:block">Account</span>
                    </Link>
                </Button>
            ) : (
                <>
                    <Button asChild variant="secondary" className="hidden sm:block">
                        <Link href="/auth/signup">Sign up</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/auth/login">Login</Link>
                    </Button>
                </>
            )}
        </>
    )
}
