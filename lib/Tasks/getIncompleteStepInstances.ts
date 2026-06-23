import { TaskInstance } from "./getTaskInstancesUntilDate"
import Task, { Step } from "@/types/Task"

export type StepInstance = {
    task: Task,
    step: Step,
    dateAvailable: string
}

export const getIncompleteStepInstances = (instances: TaskInstance[]): StepInstance[] => {
    const result: StepInstance[] = []
    for (const instance of instances) {
        const { task, dateAvailable } = instance
        if (task.occurs === "once") { // Once task
            for (const step of task.steps) {
                if (step.completed) continue
                result.push({ task, step, dateAvailable })
            }
            continue
        }
        if (task.occurs === "repeating") { // Repeating task
            for (const step of task.steps) {
                const completed = step.completions.some(completion => completion.date === dateAvailable)
                if (completed) continue
                result.push({ task, step, dateAvailable })
            }
        }
    }
    return result
}