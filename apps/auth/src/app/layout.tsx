import type { Metadata } from "next"
import Link from "next/link"
import "@ui/globals"
import { APPLICATION_NAME } from "@config"

export const metadata: Metadata = {
    title: "Karr Auth",
    description: "Authentication service for Karr",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const dark = false
    return (
        <html lang="en" className={dark ? "dark" : ""}>
            <body className="bg-slate-200 text-slate-950 dark:text-slate-200 dark:bg-slate-950 m-0 p-0">
                <div className="grid h-screen grid-rows-[auto_1fr] grid-cols-1">
                    <header className="flex flex-row items-center justify-between h-16 w-full text-3xl px-4 py-2">
                        <h1>
                            <Link href="/">
                                {APPLICATION_NAME} Auth
                            </Link>
                        </h1>
                        <nav className="flex flex-row justify-end gap-4 text-lg">
                            <Link href="/about">About Karr</Link>
                        </nav>
                    </header>
                    <main className="flex flex-col justify-center items-center h-full overflow-y-scroll">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
