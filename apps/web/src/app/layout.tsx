import type { Metadata } from "next"
import localFont from "next/font/local"
import Image from "next/image"
import logo from "@/assets/logo-tmp.jpg"
import AppName from "@/components/AppName"
import ThemeProvider from "@/components/ThemeProvider"

import getAppConfig from "@karr/config"

import "@/assets/globals.css"

import Link from "next/link"
import ThemeSwitch from "@/components/ThemeSwitch"

import { Button } from "@karr/ui/components/button"

import LoginAccount from "./loginaccount"

const geistSans = localFont({
    src: "../assets/fonts/GeistVF.woff",
    variable: "--font-geist-sans"
})

const baskervville = localFont({
    src: "../assets/fonts/BaskervvilleRegular.woff2",
    variable: "--font-baskervville",
    display: "swap"
})

export const metadata: Metadata = {
    title: getAppConfig().APPLICATION_NAME,
    description: `${getAppConfig().APPLICATION_NAME} is a federated carpool platform.`
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${geistSans.variable} ${baskervville.variable}`}
        >
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="bg-background text-foreground grid h-screen grid-cols-1 grid-rows-[auto_1fr] font-sans">
                        <header className="flex h-16 w-full flex-row items-center justify-between px-4 py-2 text-3xl">
                            <div className="flex flex-row items-center justify-end gap-8">
                                <Link
                                    href="/"
                                    className="flex flex-row items-center justify-start gap-4 font-mono font-black"
                                >
                                    <Image
                                        src={logo}
                                        alt="Karr"
                                        width={40}
                                        height={40}
                                        className="rounded-lg"
                                    />
                                    <AppName />
                                </Link>
                                <nav className="flex flex-row items-center justify-end gap-4 text-lg">
                                    <Button asChild variant="link">
                                        <Link href="/search">Search for trips</Link>
                                    </Button>
                                </nav>
                            </div>
                            <div className="flex flex-row items-center justify-end gap-8">
                                <nav className="flex flex-row items-center justify-end gap-4 text-lg">
                                    <LoginAccount />
                                </nav>
                                <ThemeSwitch />
                            </div>
                        </header>
                        <main className="flex h-full flex-col items-center justify-center overflow-y-scroll">
                            {children}
                        </main>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    )
}
