import { cookies } from "next/headers"
import Link from "next/link"
import { User as IconUser } from "lucide-react"

import { Button } from "@karr/ui/components/button"

export default async function LoginAccount() {
    const c = await cookies()
    const isAuthenticated = c.get("auth-token") !== undefined

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
