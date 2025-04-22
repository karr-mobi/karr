import type { Metadata } from "next"
import localFont from "next/font/local"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

import { Toaster } from "@karr/ui/components/sonner"

import { routing } from "@/i18n/routing"
import { APPLICATION_NAME } from "@/util/appname"
import "@/assets/globals.css"
import { Locale } from "@/../global"

import { Footer } from "~/_components/footer"
import { Header } from "~/_components/header"
import { Providers } from "~/_components/Providers"

const geistSans = localFont({
    src: "../../assets/fonts/GeistVF.woff",
    variable: "--font-geist-sans"
})

const baskervville = localFont({
    src: "../../assets/fonts/BaskervvilleRegular.woff2",
    variable: "--font-baskervville",
    display: "swap"
})

export const metadata: Metadata = {
    title: APPLICATION_NAME,
    description: `${APPLICATION_NAME} is a federated carpool platform.`
}

export default async function RootLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode
    params: Promise<{ locale: Locale }>
}>) {
    const { locale } = await params

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale)) {
        notFound()
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages()

    return (
        <html
            lang={locale}
            suppressHydrationWarning
            className={`${geistSans.variable} ${baskervville.variable}`}
        >
            <head>
                {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
            </head>
            <body>
                <Providers>
                    <NextIntlClientProvider messages={messages}>
                        <div className="grid h-screen grid-cols-1 grid-rows-[auto_1fr]">
                            <Header />
                            <main className="mx-4 mt-4 flex h-full flex-col items-start justify-start">
                                {children}
                            </main>
                            <Footer />
                        </div>
                        <Toaster richColors />
                    </NextIntlClientProvider>
                </Providers>
            </body>
        </html>
    )
}
