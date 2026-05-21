import { OnceTask } from "@/types/Task"

export default function getCompletion(task: OnceTask): number {
    let totalMinutes = 0
    let completedMinutes = 0
    for (const step of task.steps) {
        totalMinutes += step.duration
        if (step.completed) completedMinutes += step.duration
    }
    return Math.round((completedMinutes / totalMinutes) * 100) / 100
}