"use client"

import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/logo-tmp.jpg"
import { footer } from "@/lib/content"

export default function Footer() {
    return (
        <motion.footer
            className="w-full border-t py-6 md:py-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <div className="flex items-center gap-2">
                    <Image
                        src={logo}
                        alt="Logo"
                        width={20}
                        height={20}
                        className="rounded-sm"
                    />
                    <p className="text-muted-foreground text-sm">
                        {footer.note}
                    </p>
                </div>
                <div className="flex flex-col items-center gap-4 md:flex-row">
                    <nav className="flex gap-4 md:gap-6">
                        {footer.links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="font-medium text-sm underline-offset-4 hover:underline"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex items-center gap-4">
                        {footer.socialLinks.map((link) => (
                            <motion.div
                                key={link.name}
                                whileHover={{ scale: 1.2, rotate: 5 }}
                            >
                                <Link
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    {<link.icon className="h-5 w-5" />}
                                    <span className="sr-only">{link.name}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.footer>
    )
}
