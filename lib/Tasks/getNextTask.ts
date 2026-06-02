import Task from "@/types/Task"
import { getIncompleteStepInstancesUntilDate } from "./getDateTasks"

export const getNextTask = (tasks: Task[]) => {
    const today = new Date()
    const instances = getIncompleteStepInstancesUntilDate(tasks, today)
    const instance = instances.length ? instances[0] : undefined
    if (!instance) return undefined
    return {
        
    }
}