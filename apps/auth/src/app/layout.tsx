import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
    title: "Karr Auth",
    description: "Authentication service for Karr",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="bg-black">
            <body className="bg-black text-white">
                <header className="w-full bg-red-600 text-3xl px-4 py-2">
                    <h1>
                        <Link href="/">
                            Karr Auth
                        </Link>
                    </h1>
                </header>
                {children}
            </body>
        </html>
    )
}
