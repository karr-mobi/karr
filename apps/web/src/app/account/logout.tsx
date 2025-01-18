"use client"

import { useRouter } from "next/navigation"

import { Button } from "@karr/ui/components/button"

import { apiFetch } from "@/util/apifetch"
import { setAuthentication } from "@/util/auth"

export default function Logout() {
    const router = useRouter()

    async function logout() {
        await apiFetch("/auth/logout", {
            method: "GET"
        })
        setAuthentication(false)
        router.push("/")
    }

    return (
        <Button onClick={logout} className="mt-2 mb-6">
            Logout
        </Button>
    )
}
