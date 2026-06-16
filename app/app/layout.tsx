import { ReactNode } from "react"
import AppNavigationFrame from "@/components/AppNavigationFrame"
import PrivateRoute from "@/components/PrivateRoute"
import TasksProvider from "@/providers/TasksProvider"
import EventsProvider from "@/providers/EventsProvider"
import RemindersProvider from "@/providers/RemindersProvider"

type RootLayoutProps = {
	children: ReactNode
}

export default function AppLayout(props: RootLayoutProps) {
	return (
		<PrivateRoute>
			<TasksProvider>
				<EventsProvider>
					<RemindersProvider>
						<AppNavigationFrame>
							{props.children}
						</AppNavigationFrame>
					</RemindersProvider>
				</EventsProvider>
			</TasksProvider>
		</PrivateRoute>
	)
}
