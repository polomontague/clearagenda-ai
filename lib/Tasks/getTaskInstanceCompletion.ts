import { TaskInstance } from "./getTaskInstancesUntilDate"
import Task from "@/types/Task"

export const getTaskInstanceCompletion = (task: Task, dateAvailable: string): number => {
    const totalDuration = task.steps.reduce((total, step) => {
        return total + step.duration
    }, 0)
    const completedDuration = task.occurs === "once" ? (
        task.steps.reduce((total, step) => {
            return total + (step.completed ? step.duration : 0)
        }, 0)
    ) : task.steps.reduce((total, step) => {
        const completion = step.completions.find(completion => completion.date === dateAvailable)
        return total + (completion ? step.duration : 0)
    }, 0)
    return Math.round((completedDuration / totalDuration) * 100) / 100
}