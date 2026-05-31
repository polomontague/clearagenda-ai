"use client"
import { ReactNode, useContext, useEffect } from "react"
import UserContext from "@/contexts/UserContext"
import useTheme from "@/hooks/useTheme"
import Appearance from "@/constants/Appearance"

type AppearanceProviderProps = {
    children: ReactNode
}

export default function AppearanceProvider(props: AppearanceProviderProps) {
    const { user } = useContext(UserContext)
    const systemTheme = useTheme()

    useEffect(() => {
        const theme = user?.preferences.theme ?? Appearance.DEFAULT_THEME
        const accent = user?.preferences.accent ?? Appearance.DEFAULT_ACCENT
        document.documentElement.dataset.theme = theme
        document.documentElement.dataset.accent = accent
        // Update meta theme color
        const effectiveTheme = theme === "system" ? systemTheme : theme
        const color = effectiveTheme === "light" ? Appearance.LIGHT : Appearance.DARK
        // SSR injects 2 meta tags for "system" theme (one for light mode and one for dark mode)
        const metaTags = document.querySelectorAll('meta[name="theme-color"]')
        metaTags.forEach(tag => tag.setAttribute("content", color))
    }, [user, systemTheme])

    return props.children
}