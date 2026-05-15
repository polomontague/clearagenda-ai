import Task, { OnceTask } from "@/types/Task"
import Utility from "./Utility"
import User from "@/types/User"

const Tasks = {
    getLength: (task: Task): string => {
        let minutes = task.steps.reduce((total, step) => total + step.duration, 0)
        return Utility.formatDuration(minutes)
    },
    getDeadline: (task: Task): string => {
        if (!task.deadline) return "None"
        if (task.occurs === "once") {
            return Utility.formatDate(Utility.loadLocalDate(task.deadline))
        } else { // Repeating
            return `${task.deadline} ${task.deadline === 1 ? "Day" : "Days"}`
        }
        
    },
    getCompletion: (task: OnceTask): number => {
        let totalMinutes = 0
        let completedMinutes = 0
        for (const step of task.steps) {
            totalMinutes += step.duration
            if (step.completed) completedMinutes += step.duration
        }
        return Math.round((completedMinutes / totalMinutes) * 100) / 100
    },
    getStatus: (task: Task, user: User): {
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
            const completion = Tasks.getCompletion(task)
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
}

export default Tasks