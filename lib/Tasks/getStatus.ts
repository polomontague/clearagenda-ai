import Task from "@/types/Task"
import User from "@/types/User"
import Tasks from "."
import Utility from "../Utility"

export default function getStatus(task: Task, user: User): {
    code: "completed" | "overdue" | "upcoming" | "in_progress" | "repeating" | "repeating_ended",
    color: string,
    label: string
} {
    const accent = user.preferences.accent
    const COLORS = {
        sky: accent === "sky" ? "var(--turquoise)" : "var(--sky)",
        red: accent === "red" ? "var(--coral)" : "var(--red)",
        yellow: accent === "yellow" ? "var(--orange)" : "var(--yellow)",
        lavender: accent === "lavender" ? "var(--pink)" : "var(--lavender)",
        gray: "var(--layer-4-light)"
    }
    if (task.occurs === "once") {
        const completion = Tasks.getCompletion(task)
        if (completion === 1) return { code: "completed", color: COLORS.gray, label: "Completed" }
        if (task.deadline) {
            const now = new Date()
            const deadline = Utility.loadLocalDate(task.deadline)
            deadline.setDate(deadline.getDate() + 1)
            deadline.setHours(0, 0, 0, 0)
            const overdue = deadline.getTime() < now.getTime()
            if (overdue) return { code: "overdue", color: COLORS.red, label: "Overdue" }
        }
        if (completion === 0) return { code: "upcoming", color: COLORS.sky, label: "Upcoming" }
        return { code: "in_progress", color: COLORS.yellow, label: "In Progress" }
    } else { // repeating
        const ended = Utility.getLocalRepeatingEnded(task.repeat)
        if (ended) return { code: "repeating_ended", color: COLORS.gray, label: "Repeating Ended" }
        return { code: "repeating", color: COLORS.lavender, label: "Repeating" }
    }
}