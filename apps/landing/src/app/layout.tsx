import type { Metadata } from "next"
import localFont from "next/font/local"

import { PostHogProvider } from "./providers"

import "@karr/ui/globals.css"
import "./styles.css"

export const metadata: Metadata = {
    title: "Karr",
    description: "Karr landing page"
}

const geistSans = localFont({
    src: "../assets/fonts/GeistVF.woff",
    variable: "--font-geist-sans"
})

const baskervville = localFont({
    src: "../assets/fonts/BaskervvilleRegular.woff2",
    variable: "--font-baskervville",
    display: "swap"
})

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${baskervville.variable}`}
        >
            <body>
                <PostHogProvider>{children}</PostHogProvider>
            </body>
        </html>
    )
}
