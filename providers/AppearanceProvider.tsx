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
        if (user) {
            const theme = user.preferences.theme
            const accent = user.preferences.accent
            window.localStorage.setItem("theme", theme)
            window.localStorage.setItem("accent", accent)

            document.documentElement.dataset.theme = theme
            document.documentElement.dataset.accent = accent
            // Update meta theme color
            const color = theme === "light" ? Appearance.LIGHT : theme === "dark" ? Appearance.DARK : ( // appearance is "system"
                systemTheme === "light" ? Appearance.LIGHT : Appearance.DARK
            )
            updateMetaThemeColor(color)
        }
    }, [user])

    useEffect(() => {
        const color = systemTheme === "light" ? Appearance.LIGHT : Appearance.DARK
        updateMetaThemeColor(color)
    }, [systemTheme])

    const updateMetaThemeColor = (color: string) => {
        // SSR injects 2 meta tags for "system" theme (one for light mode and one for dark mode)
        const metaTags = document.querySelectorAll('meta[name="theme-color"]')
        metaTags.forEach(tag => tag.setAttribute("content", color))
    }

    return props.children
}