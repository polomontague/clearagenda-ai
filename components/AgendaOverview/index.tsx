import styles from "./AgendaOverview.module.css"
import Card from "../Card"

type AgendaOverviewProps = {
    day: Date
}

export default function AgendaOverview({ day }: AgendaOverviewProps) {
    return (
        <Card label="Overview">
            
        </Card>
    )
}