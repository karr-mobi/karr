import type { Metadata } from "next"
import localFont from "next/font/local"
import Image from "next/image"
import logo from "@/assets/logo-tmp.jpg"
import AppName from "@/components/appname"

import getAppConfig from "@karr/config"

import "@/assets/globals.css"

import Link from "next/link"

import LoginAccount from "./loginaccount"

const geistSans = localFont({
    src: "../assets/fonts/GeistVF.woff",
    variable: "--font-geist-sans"
})
const geistMono = localFont({
    src: "../assets/fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono"
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
        <html lang="en" className="bg-[#1e1e1e] text-[#e1e1e1]">
            <body>
                <div
                    className={`grid h-screen grid-cols-1 grid-rows-[auto_1fr] ${geistSans.variable} ${geistMono.variable}`}
                >
                    <header className="flex h-16 w-full flex-row items-center justify-between px-4 py-2 text-3xl">
                        <div className="flex flex-row items-center justify-end gap-8">
                            <Link
                                href="/"
                                className="flex flex-row items-center justify-start gap-4"
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
                                <Link href="/search">Search for trips</Link>
                            </nav>
                        </div>
                        <nav className="flex flex-row items-center justify-end gap-4 text-lg">
                            <LoginAccount />
                        </nav>
                    </header>
                    <main className="flex h-full flex-col items-center justify-center overflow-y-scroll">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
