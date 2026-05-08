import { ReactNode } from "react"
import AppNavigationFrame from "@/components/AppNavigationFrame"
import PrivateRoute from "@/components/PrivateRoute"
import ItemsProvider from "@/providers/ItemsProvider"
import TasksProvider from "@/providers/TasksProvider"

type RootLayoutProps = {
	children: ReactNode
}

export default function AppLayout(props: RootLayoutProps) {
	return (
		<PrivateRoute>
			<ItemsProvider>
				<TasksProvider>
					<AppNavigationFrame>
						{props.children}
					</AppNavigationFrame>
				</TasksProvider>
			</ItemsProvider>
		</PrivateRoute>
	)
}
