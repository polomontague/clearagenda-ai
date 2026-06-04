import { TaskOccurrence } from "@/types/Task"

export const getTotalDuration = (tasks: TaskOccurrence[]): number => {
    let total = 0
    for (const task of tasks) {
        for (const step of task.steps) {
            total += step.duration
        }
    }
    return total
}