import { ReactNode } from "react"
import AppNavigationFrame from "@/components/AppNavigationFrame"
import PrivateRoute from "@/components/PrivateRoute"

type RootLayoutProps = {
	children: ReactNode
}

export default function AppLayout(props: RootLayoutProps) {
	return (
		<PrivateRoute>
			<AppNavigationFrame>
				{props.children}
			</AppNavigationFrame>
		</PrivateRoute>
	)
}
