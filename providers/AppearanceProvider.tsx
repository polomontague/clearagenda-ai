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
        const theme = window.localStorage.getItem("theme") ?? Appearance.DEFAULT_THEME
        const accent = window.localStorage.getItem("accent") ?? Appearance.DEFAULT_ACCENT
        document.documentElement.dataset.theme = theme
        document.documentElement.dataset.accent = accent
    }, [])

    useEffect(() => {
        if (user) {
            const theme = user.preferences.theme === "system" ? systemTheme : user.preferences.theme
            const accent = user.preferences.accent
            window.localStorage.setItem("theme", theme)
            window.localStorage.setItem("accent", accent)

            document.documentElement.dataset.theme = theme
            document.documentElement.dataset.accent = accent
        }
    }, [user, systemTheme])

    return props.children
}