import Task from "@/types/Task"
import Utility from "../Utility"

export const getDateCompletedTaskOccupancy = (tasks: Task[], date: Date): number => {
    const dateKey = Utility.getDateKey(date)
    let total = 0
    for (const task of tasks) {
        // Once tasks
        if (task.occurs === "once") {
            for (const step of task.steps) {
                if (!step.completed) continue
                const completedDateKey = Utility.getDateKey(new Date(step.completed))
                if (completedDateKey === dateKey) {
                    total += step.duration
                }
            }
        }
        // Repeating tasks
        if (task.occurs === "repeating") {
            for (const step of task.steps) {
                for (const completion of step.completions) {
                    const completedDateKey = Utility.getDateKey(new Date(completion.completed))
                    if (completedDateKey === dateKey) {
                        total += step.duration
                    }
                }
            }
        }
    }
    return total
}