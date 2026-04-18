import { ReactNode } from "react"
import AppNavigationFrame from "@/components/AppNavigationFrame"
import PrivateRoute from "@/components/PrivateRoute"
import ItemsProvider from "@/providers/ItemsProvider"

type RootLayoutProps = {
	children: ReactNode
}

export default function AppLayout(props: RootLayoutProps) {
	return (
		<PrivateRoute>
			<ItemsProvider>
				<AppNavigationFrame>
					{props.children}
				</AppNavigationFrame>
			</ItemsProvider>
		</PrivateRoute>
	)
}
