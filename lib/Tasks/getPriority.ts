import { getIncompleteDuration } from "./getIncompleteDuration"
import { getUrgencyPressure } from "./getUrgencyPressure"
import Task from "@/types/Task"
import { getTaskInstanceCompletion } from "./getTaskInstanceCompletion"

export const getPriority = (task: Task, dateAvailable: string): number => {
    let score = 1
    // Urgency Pressure Score
    const pressure = getUrgencyPressure(task, dateAvailable)
    score += pressure
    // Importance
    score *= (1 + task.importance * 0.5)
    // Partially Complete
    const completion = getTaskInstanceCompletion(task, dateAvailable)
    if (completion > 0) {
        score *= (1 + completion * 0.1)
    }
    // Short Tasks - bump up
    const incompleteDuration = getIncompleteDuration(task, dateAvailable)
    const shortTaskBoost = 1 / (1 + incompleteDuration / 30)
    score *= (1 + shortTaskBoost * 0.15)
    return score
}