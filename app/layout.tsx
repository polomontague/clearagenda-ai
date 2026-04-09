import "./reset.css"
import "./globals.css"
import { ReactNode } from "react"
import NavigationFrame from "@/components/NavigationFrame"
import { CalendarIcon, BrainIcon } from "@/components/Icons"
import { UserProvider } from "@/contexts/UserContext"
import CookiesProvider from "@/components/CookiesProvider"
import Appearance from "@/constants/Appearance"

type RootLayoutProps = {
	children: ReactNode
}

export default function RootLayout(props: RootLayoutProps) {
	return (
		<html lang="en" data-theme={Appearance.DEFAULT_THEME} data-accent={Appearance.DEFAULT_ACCENT}>
		<body>
			<CookiesProvider>
				<UserProvider>
					<NavigationFrame
						links={[
							{
								icon: <CalendarIcon />,
								href: "/agenda",
								label: "Agenda"
							},
							{
								icon: <BrainIcon />,
								href: "/memory",
								label: "Memory"
							}
						]}
					>
						{props.children}
					</NavigationFrame>
				</UserProvider>
			</CookiesProvider>
		</body>
		</html>
	)
}
