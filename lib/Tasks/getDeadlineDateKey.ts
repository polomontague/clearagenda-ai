import Utility from "../Utility"
import { StepInstance } from "./getIncompleteStepInstances"

export const getDeadlineDateKey = (instance: StepInstance): string | undefined => {
    if (!instance.task.deadline) return undefined
    let deadline
    if (instance.task.occurs === "once") {
        deadline = Utility.loadLocalDate(instance.task.deadline)
    } else { // Repeating
        deadline = Utility.loadLocalDate(instance.dateAvailable)
        deadline.setHours(0, 0, 0, 0) // just to be safe about DST shifts
        deadline.setDate(deadline.getDate() + (instance.task.deadline - 1)) // Subtract 1 because the first day of the deadline window is the occurrence day
    }
    return Utility.getDateKey(deadline)
}