import { AuthProvider } from "@/lib/auth/context"

export default function AuthedLayout({
    children
}: {
    children: React.ReactNode
}) {
    return <AuthProvider>{children}</AuthProvider>
}
