import Task from "@/types/Task"
import { StepInstance } from "./getIncompleteStepInstances"
import Utility from "../Utility"

export const getDateCompletedStepInstances = (tasks: Task[], date: Date): StepInstance[] => {
    const instances: (StepInstance & {
        completed: string
    })[] = []
    const dateKey = Utility.getDateKey(date)
    const today = new Date()
    const todayDateKey = Utility.getDateKey(today)
    for (const task of tasks) {
        if (task.occurs === "once") {
            for (const step of task.steps) {
                if (!step.completed) continue
                const completedDateKey = Utility.getDateKey(new Date(step.completed))
                if (completedDateKey !== dateKey) continue
                instances.push({
                    task,
                    step,
                    dateAvailable: todayDateKey,
                    completed: step.completed
                })
                continue
            }
        }
        if (task.occurs === "repeating") {
            for (const step of task.steps) {
                for (const completion of step.completions) {
                    const occurrenceDateKey = Utility.getDateKey(Utility.loadLocalDate(completion.date))
                    const completedDateKey = Utility.getDateKey(new Date(completion.completed))
                    if (completedDateKey !== dateKey) continue
                    instances.push({
                        task,
                        step,
                        dateAvailable: occurrenceDateKey,
                        completed: completion.completed
                    })
                }
            }
        }
    }
    // Sort instances by completion date
    instances.sort((a, b) => a.completed.localeCompare(b.completed))
    return instances.map(({ completed, ...instance }) => instance)
}