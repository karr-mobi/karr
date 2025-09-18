"use client"

import type { UserProperties } from "@karr/auth/subjects"
import type React from "react"
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react"

interface AuthContextValue {
    authState: UserProperties | null
    loading: boolean
    error: Error | null
    refreshAuth: () => Promise<void>
    clearAuth: () => void
}

// Create the auth context
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<UserProperties | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isMountedRef = useRef(true)

    // Fetch auth state function
    const fetchAuthState = useCallback(async () => {
        try {
            setError(null)

            // Import the auth function dynamically to avoid issues with server actions
            const { auth } = await import("@/lib/auth/actions")
            const result = await auth()

            if (isMountedRef.current) {
                if (result === false) {
                    setAuthState(null)
                } else {
                    setAuthState(result)
                }
            }
        } catch (err) {
            console.error("Failed to fetch auth state:", err)
            if (isMountedRef.current) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error("Failed to fetch auth state")
                )
                setAuthState(null)
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false)
            }
        }
    }, [])

    // Manual refresh function
    const refreshAuth = useCallback(async () => {
        setLoading(true)
        await fetchAuthState()
    }, [fetchAuthState])

    // Clear auth state function
    const clearAuth = useCallback(() => {
        setAuthState(null)
        setError(null)
        setLoading(false)
    }, [])

    // Initial auth state fetch
    useEffect(() => {
        isMountedRef.current = true
        void fetchAuthState()

        // Set up periodic refresh every 5 minutes
        const intervalId = setInterval(
            () => {
                void fetchAuthState()
            },
            5 * 60 * 1000
        )

        // Listen for storage events to sync auth state across tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "auth-state-change") {
                void fetchAuthState()
            }
        }
        window.addEventListener("storage", handleStorageChange)

        // Listen for custom auth events
        const handleAuthChange = () => {
            void fetchAuthState()
        }
        window.addEventListener("auth-state-changed", handleAuthChange)

        return () => {
            isMountedRef.current = false
            clearInterval(intervalId)
            window.removeEventListener("storage", handleStorageChange)
            window.removeEventListener("auth-state-changed", handleAuthChange)
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current)
            }
        }
    }, [fetchAuthState])

    // Re-fetch auth state when the page becomes visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible" && !loading) {
                void fetchAuthState()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            )
        }
    }, [fetchAuthState, loading])

    const value: AuthContextValue = {
        authState,
        loading,
        error,
        refreshAuth,
        clearAuth
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

// Helper function to trigger auth state refresh across all tabs/windows
export function triggerAuthRefresh() {
    // Trigger storage event for other tabs
    try {
        localStorage.setItem("auth-state-change", Date.now().toString())
    } catch (e) {
        console.error("Failed to trigger storage event:", e)
    }

    // Trigger custom event for current tab
    window.dispatchEvent(new Event("auth-state-changed"))
}
