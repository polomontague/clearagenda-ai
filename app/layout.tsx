import "./reset.css"
import "./variables.css"
import "./themes.css"
import "./accents.css"
import "./globals.css"
import CookiesProvider from "@/providers/CookiesProvider"
import { ReactNode } from "react"
import { UserProvider } from "@/contexts/UserContext"
import AppearanceProvider from "@/providers/AppearanceProvider"
import Appearance from "@/constants/Appearance"
import Auth from "@/lib/Auth"

type RootLayoutProps = {
    children: ReactNode
}

export const generateViewport = async () => {
    const user = await Auth.getUser()
    const theme = user?.preferences.theme ?? Appearance.DEFAULT_THEME
    if (theme === "light") return {
        themeColor: Appearance.LIGHT
    }
    if (theme === "dark") return {
        themeColor: Appearance.DARK
    }
    return {
        themeColor: [
            {
                media: "(prefers-color-scheme: light)",
                color: Appearance.LIGHT
            },
            {
                media: "(prefers-color-scheme: dark)",
                color: Appearance.DARK
            }
        ]
    }
}

export default async function RootLayout(props: RootLayoutProps) {
    const user = await Auth.getUser()
    const theme = user?.preferences.theme ?? Appearance.DEFAULT_THEME
    const accent = user?.preferences.accent ?? Appearance.DEFAULT_ACCENT
    
    return (
        <html
            lang="en"
            data-theme={theme}
            data-accent={accent}
        >
		<body>
            <CookiesProvider>
                <UserProvider>
                    <AppearanceProvider>
                        {props.children}
                    </AppearanceProvider>
                </UserProvider>
            </CookiesProvider>
        </body>
        </html>
    )
}