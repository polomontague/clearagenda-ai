import { TaskOccurrence } from "@/types/Task"

export const getTotalCompletion = (tasks: TaskOccurrence[]): number => {
    let totalDuration = 0
    let completedDuration = 0
    for (const task of tasks) {
        for (const step of task.steps) {
            totalDuration += step.duration
            if (step.completed) completedDuration += step.duration
        }
    }
    if (!totalDuration) return 0
    return Math.round((completedDuration / totalDuration) * 100) / 100
}