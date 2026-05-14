import Task, { OnceTask } from "@/types/Task"
import Utility from "./Utility"

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
    }
}

export default Tasks