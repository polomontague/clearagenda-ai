import styles from "./CoreFeatures.module.css"
import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import Cards from "../Cards"
import Emphasis from "../Emphasis"
import { AlphabetBookIcon, BrainIcon, CalendarIcon, CheckMarkIcon, ControlsIcon, SplitArrowsIcon } from "../Icons"
import Paragraph from "../Paragraph"

export default function CoreFeatures() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Eyebrow>Core features</Eyebrow>
                <Heading margin>Designed to <Emphasis>remove mental load</Emphasis>, not add features</Heading>
                <Paragraph margin>Every feature exists to eliminate planning, reduce decisions, and keep you moving forward.</Paragraph>
                <Cards
                    cards={[
                        {
                            icon: <CalendarIcon />,
                            label: "Smart Scheduling",
                            content: "Tasks are automatically placed into your calendar based on availability and priority. No dragging, sorting, o reorganizing required."
                        },
                        {
                            icon: <SplitArrowsIcon />,
                            label: "Task Breakdown AI",
                            content: "Large, vague projects become clear, actionable steps you can start immediately."
                        },
                        {
                            icon: <ControlsIcon />,
                            label: "Daily Capacity Controls",
                            content: "Set how many hours you want to allocate each day. Your plan adapts to your schedule instead of demanding more from you."
                        },
                        {
                            icon: <BrainIcon />,
                            label: "Memory Bank",
                            content: "Every task, reminder, and goal is stored and tracked so nothing slips through the cracks."
                        },
                        {
                            icon: <CheckMarkIcon />,
                            label: "Always Current Plan",
                            content: "Your schedule updates as life changes, keeping your plan realistic and actionable."
                        },
                        {
                            icon: <AlphabetBookIcon />,
                            label: "Natural Language Input",
                            content: "Simply describe what you need to do. ClearAgenda AI handles the organization for you."
                        }
                    ]}
                />
            </div>
        </section>
    )
}