"use client"

import { Moon as IconMoon, Sun as IconSun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@karr/ui/components/button"

export default function ThemeSwitch() {
    const { resolvedTheme, setTheme } = useTheme()

    function toggleTheme() {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    return (
        <Button variant="outline" size="icon" onClick={toggleTheme}>
            <IconSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <IconMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
