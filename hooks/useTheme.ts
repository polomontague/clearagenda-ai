"use client"
import { useEffect, useState } from "react"
import Theme from "@/types/Theme"
import Appearance from "@/constants/Appearance"

export default function useTheme() {
    const [theme, setTheme] = useState<Exclude<Theme, "device">>(Appearance.DEFAULT_THEME)

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        setTheme(mediaQuery.matches ? "dark" : "light")
        
        const handler = (evt: MediaQueryListEvent) => setTheme(evt.matches ? "dark" : "light")
        mediaQuery.addEventListener("change", handler)
        return () => mediaQuery.removeEventListener("change", handler)
    }, [])

    return theme
}