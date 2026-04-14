import "./reset.css"
import "./globals.css"
import CookiesProvider from "@/providers/CookiesProvider"
import { ReactNode } from "react"
import { UserProvider } from "@/contexts/UserContext"
import AppearanceProvider from "@/providers/AppearanceProvider"

type RootLayoutProps = {
    children: ReactNode
}

export default function RootLayout(props: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
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