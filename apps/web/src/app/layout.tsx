import type { Metadata } from "next"
import localFont from "next/font/local"
import Image from "next/image"
import Link from "next/link"

import { APPLICATION_NAME } from "@karr/config/static"
import { Button } from "@karr/ui/components/button"
import { Separator } from "@karr/ui/components/separator"
import { Toaster } from "@karr/ui/components/sonner"

import logo from "@/assets/logo-tmp.jpg"

import "@/assets/globals.css"

import Footer from "./_components/footer"
import LoginAccount from "./_components/loginaccount"
import ThemeProvider from "./_components/ThemeProvider"
import ThemeSwitch from "./_components/ThemeSwitch"
import { CSPostHogProvider } from "./providers"

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
    title: APPLICATION_NAME,
    description: `${APPLICATION_NAME} is a federated carpool platform.`
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
            <head>
                {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
            </head>
            <CSPostHogProvider>
                <body>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="grid h-screen grid-cols-1 grid-rows-[auto_1fr]">
                            <header className="bg-primary/4 flex h-16 w-full flex-row items-center justify-between px-4 py-2">
                                <div className="flow-inline flex flex-row items-center justify-end">
                                    <Link
                                        href="/"
                                        className="flex flex-row items-center justify-start gap-4"
                                    >
                                        <Image
                                            alt="Karr"
                                            src={logo}
                                            width={40}
                                            height={40}
                                            className="rounded-lg"
                                            placeholder="blur"
                                        />
                                        <h5>{APPLICATION_NAME}</h5>
                                    </Link>
                                    <Separator orientation="vertical" className="h-8" />
                                    <nav className="flex flex-row items-center justify-end gap-4">
                                        <Button
                                            asChild
                                            variant="link"
                                            className="text-md px-0"
                                        >
                                            <Link href="/trips/search">Trips</Link>
                                        </Button>
                                    </nav>
                                </div>
                                <div className="flex flex-row items-center justify-end gap-4">
                                    <nav className="flex flex-row items-center justify-end gap-4">
                                        <LoginAccount />
                                    </nav>
                                    <ThemeSwitch />
                                </div>
                            </header>
                            <main className="mx-4 mt-4 flex h-full flex-col items-center justify-start overflow-y-scroll">
                                {children}
                            </main>
                            <Footer />
                        </div>
                        <Toaster richColors />
                    </ThemeProvider>
                </body>
            </CSPostHogProvider>
        </html>
    )
}
