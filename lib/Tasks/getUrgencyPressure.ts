import Utility from "../Utility"
import { getIncompleteDuration } from "./getIncompleteDuration"
import Task from "@/types/Task"

export const getUrgencyPressure = (task: Task, dateAvailable: string): number => {
    if (!task.deadline) return 0
    let effectiveDeadline
    if (task.occurs === "once") {
        effectiveDeadline = Utility.loadLocalDate(task.deadline)
        effectiveDeadline.setDate(effectiveDeadline.getDate() + 1)
        effectiveDeadline.setHours(0, 0, 0, 0)
    } else { // Repeating
        effectiveDeadline = Utility.loadLocalDate(dateAvailable)
        effectiveDeadline.setDate(effectiveDeadline.getDate() + 1)
        effectiveDeadline.setHours(0, 0, 0, 0)
        effectiveDeadline.setDate(effectiveDeadline.getDate() + task.deadline) // Add deadline days
    }
    const incompleteDuration = getIncompleteDuration(task, dateAvailable)
    effectiveDeadline.setMinutes(effectiveDeadline.getMinutes() - incompleteDuration)
    const now = new Date()
    const timeRemaining = effectiveDeadline.getTime() - now.getTime()
    const daysRemaining = timeRemaining / (1000 * 60 * 60 * 24)
    let pressure = 0
    if (daysRemaining <= 0) {
        pressure = 1 + Math.abs(daysRemaining) * 2
    } else {
        pressure = 1 / (daysRemaining + 1)
    }
    return pressure
}