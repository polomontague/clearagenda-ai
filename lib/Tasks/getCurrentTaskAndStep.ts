import { TaskOccurrence } from "@/types/Task"

export default function getCurrentTaskAndStep(tasks: TaskOccurrence[], date: Date) {
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]
        for (let i2 = 0; i2 < task.steps.length; i2++) {
            const step = task.steps[i2]
            if (!step.completed) {
                return {
                    task,
                    step
                }
            }
        }
    }
}