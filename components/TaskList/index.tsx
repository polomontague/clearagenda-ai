"use client"
import { useContext } from "react"
import List, { ListItem } from "@/components/List"
import Task from "@/types/Task"
import Card from "@/components/Card"
import { EditIcon, TrashCanIcon } from "@/components/Icons"
import LabelField from "@/components/LabelField"
import Utility from "@/lib/Utility"
import InnerValue from "@/components/InnerValue"
import FieldFrame from "@/components/FieldFrame"
import UserContext from "@/contexts/UserContext"
import User from "@/types/User"
import { OnceTask } from "@/types/Item"

type TaskListProps = {
    tasks: Task[]
}

export default function TaskList(props: TaskListProps) {
    const { user } = useContext(UserContext)

    const getLength = (task: Task) => {
        let minutes = task.steps.reduce((total, step) => total + step.duration, 0)
        return Utility.formatDuration(minutes)
    }

    const getStatus = (task: Task, user: User): {
        code: "completed" | "overdue" | "upcoming" | "in_progress" | "repeating",
        color: string,
        label: string
    } => {
        const accent = user.preferences.accent
        const COLORS = {
            sky: accent === "sky" ? "var(--turquoise)" : "var(--sky)",
            red: accent === "red" ? "var(--coral)" : "var(--red)",
            yellow: accent === "yellow" ? "var(--orange)" : "var(--yellow)",
            lavender: accent === "lavender" ? "var(--pink)" : "var(--lavender)",
            gray: "var(--layer-4-light)"
        }
        if (task.occurs === "once") {
            const completion = getCompletion(task)
            if (completion === 1) return { code: "completed", color: COLORS.gray, label: "Completed" }
            if (task.deadline) {
                const [ year, month, day] = task.deadline.split("-").map(Number)
                const deadline = new Date(year, month - 1, day)
                const overdue = deadline.getTime() < new Date().getTime()
                if (overdue) return { code: "overdue", color: COLORS.red, label: "Overdue" }
            }
            if (completion === 0) return { code: "upcoming", color: COLORS.sky, label: "Upcoming" }
            return { code: "in_progress", color: COLORS.yellow, label: "In Progress" }
        } else { // repeating
            return { code: "repeating", color: COLORS.lavender, label: "Repeating" }
        }
    }

    const getCompletion = (task: OnceTask) => {
        let totalMinutes = 0
        let completedMinutes = 0
        for (const step of task.steps) {
            totalMinutes += step.duration
            if (step.completed) completedMinutes += step.duration
        }
        return Math.round((completedMinutes / totalMinutes) * 100) / 100
    }

    if (!user) return

    return (
        <List>
            {props.tasks.map((task, i) => {
                const status = getStatus(task, user)
                return (
                    <ListItem key={i}>
                        <Card
                            label={task.name}
                            buttons={[
                                {
                                    icon: <EditIcon />,
                                    onClick: () => {}
                                },
                                {
                                    icon: <TrashCanIcon />,
                                    onClick: () => {}
                                }
                            ]}
                        >
                            <FieldFrame>
                                <LabelField label="Length">
                                    <InnerValue label={getLength(task)} />
                                </LabelField>
                                <LabelField label="Status">
                                    <InnerValue
                                        color={status.color}
                                        label={status.label}
                                    />
                                </LabelField>
                            </FieldFrame>
                        </Card>
                    </ListItem>
                )
            })}
        </List>
    )
}