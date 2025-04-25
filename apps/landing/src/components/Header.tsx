"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { Menu, X } from "lucide-react"
import { Button } from "@karr/ui/components/button"
import { useMobile } from "@/hooks/use-mobile"
import logo from "@/assets/logo-tmp.jpg"

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
            className={`sticky top-0 z-50 w-full px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${scrolled ? "shadow-sm" : ""}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className="container flex h-16 items-center justify-between">
                <Link href="#">
                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src={logo}
                            alt="Karr Logo"
                            width={32}
                            height={32}
                            className="rounded"
                        />
                        <h3 className="text-lg font-bold">{header.title}</h3>
                    </motion.div>
                </Link>

                {isMobile ? (
                    <Button
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
                ) : (
                    <motion.nav
                        className="flex items-center gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
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
                                className="text-sm font-medium hover:underline underline-offset-4"
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
                )}
            </div>

            {isMobile && isMenuOpen && (
                <motion.div
                    className="fixed container pb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 left-0 right-0 px-4"
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
                                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
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
