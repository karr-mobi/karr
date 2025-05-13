"use client"

import { Button } from "@karr/ui/components/button"
import { Menu, X } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import logo from "@/assets/logo-tmp.jpg"
import { useMobile } from "@/hooks/use-mobile"

import { github, header } from "@/lib/content"

export default function Header() {
    const isMobile = useMobile()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <motion.header
            className={`sticky top-0 z-50 w-full border-b bg-background/95 px-4 backdrop-blur transition-all duration-200 supports-[backdrop-filter]:bg-background/60 ${scrolled ? "shadow-sm" : ""}`}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className="container flex h-16 items-center justify-between">
                <Link href="#">
                    <motion.div
                        className="flex items-center gap-4"
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src={logo}
                            alt="Karr Logo"
                            width={32}
                            height={32}
                            className="rounded"
                        />
                        <h3 className="font-bold text-lg">{header.title}</h3>
                    </motion.div>
                </Link>

                <Button
                    className="block md:hidden"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </Button>
                <motion.nav
                    className="hidden items-center gap-6 md:flex"
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <motion.div
                        key={github.name}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                        <Link
                            href={github.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {<github.icon className="h-5 w-5" />}
                            <span className="sr-only">{github.name}</span>
                        </Link>
                    </motion.div>
                    {header.links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="font-medium text-sm underline-offset-4 hover:underline"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button asChild>
                            <Link href={header.cta.href}>
                                {header.cta.name}
                            </Link>
                        </Button>
                    </motion.div>
                </motion.nav>
            </div>

            {isMobile && isMenuOpen && (
                <motion.div
                    className="container fixed right-0 left-0 bg-background/95 px-4 pb-4 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <nav className="flex flex-col gap-2">
                        {header.links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="rounded-md px-3 py-2 font-medium text-sm hover:bg-accent"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Button
                            asChild
                            className="mt-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Link href={header.cta.href}>
                                {header.cta.name}
                            </Link>
                        </Button>
                    </nav>
                </motion.div>
            )}
        </motion.header>
    )
}
