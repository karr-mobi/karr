import { AuthProvider } from "~/auth/context"

export default function AuthedLayout({
    children
}: {
    children: React.ReactNode
}) {
    return <AuthProvider>{children}</AuthProvider>
}
