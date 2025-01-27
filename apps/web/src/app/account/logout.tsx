"use client"

import { useRouter } from "next/navigation"

import { Button } from "@karr/ui/components/button"

import { apiFetch } from "@/util/apifetch"

export default function Logout() {
    const router = useRouter()

    async function logout() {
        await apiFetch("/auth/logout", {
            method: "GET"
        })
        router.push("/")
        router.refresh()
    }

    return (
        <Button onClick={logout} className="mb-6 mt-2">
            Logout
        </Button>
    )
}
