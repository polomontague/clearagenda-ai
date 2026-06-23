import Utility from "../Utility"
import Task from "@/types/Task"
import { getPriority } from "./getPriority"
import occursOnLocalDate from "./occursOnLocalDate"

export type TaskInstance = {
    task: Task,
    dateAvailable: string,
    priority: number
}

export const getTaskInstancesUntilDate = (tasks: Task[], date: Date): TaskInstance[] => {
    const result: TaskInstance[] = []
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date(date) // time already normalized from copy of start
    const startKey = Utility.getDateKey(start)
    for (const task of tasks) {
        // Once task
        if (task.occurs === "once") {
            result.push({
                task,
                dateAvailable: startKey,
                priority: getPriority(task, startKey)
            })
            continue
        }
        // Repeating task
        const current = Utility.loadLocalDate(task.repeat.starts)
        while (current.getTime() <+ end.getTime()) {
            if (occursOnLocalDate(task.repeat, current)) {
                const occurrenceKey = Utility.getDateKey(current)
                result.push({
                    task,
                    dateAvailable: occurrenceKey,
                    priority: getPriority(task, occurrenceKey)
                })
            }
            current.setDate(current.getDate() + 1)
        }
    }
    return result
}