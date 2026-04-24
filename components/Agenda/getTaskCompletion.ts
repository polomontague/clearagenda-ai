import { Task } from "@/types/Item"

export default function getTaskCompletion(item: Task) {
    let totalMinutes = 0
    let completedMinutes = 0
    for (const step of item.steps) {
        totalMinutes += step.duration
        if (step.completed) completedMinutes += step.duration
    }
    return completedMinutes / totalMinutes
}