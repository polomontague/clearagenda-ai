import "./reset.css"
import "./globals.css"
import { ReactNode } from "react"
import NavigationFrame from "@/components/NavigationFrame"
import { CalendarIcon, BrainIcon } from "@/components/Icons"

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
		</body>
		</html>
	)
}
