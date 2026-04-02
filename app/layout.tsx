import "./reset.css"
import "./globals.css"
import { ReactNode } from "react"
import NavigationFrame from "@/components/NavigationFrame"
import { CalendarIcon } from "@/components/Icons"

type RootLayoutProps = {
	children: ReactNode
}

export default function RootLayout(props: RootLayoutProps) {
	return (
		<html lang="en">
		<body>
			<NavigationFrame
				links={[
					{
						icon: <CalendarIcon />,
						href: "/calendar",
						label: "Calendar"
					}
				]}
			>
				{props.children}
			</NavigationFrame>
		</body>
		</html>
	)
}
