"use client"

import type { UserProperties } from "@karr/auth/subjects"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Create the auth context
const AuthContext = createContext<{
    authState: UserProperties | undefined
    loading: boolean
}>({
    authState: undefined,
    loading: true
})

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<UserProperties | undefined>(
        undefined
    )
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAuthState() {
            try {
                // You'll need to import the auth function
                const { auth } = await import("~/auth/actions")
                const result = await auth()
                setAuthState(result || undefined)
            } catch (error) {
                console.error("Failed to fetch auth state:", error)
                setAuthState(undefined)
            } finally {
                setLoading(false)
            }
        }

        void fetchAuthState()
    }, [])

    return (
        <AuthContext.Provider value={{ authState, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
