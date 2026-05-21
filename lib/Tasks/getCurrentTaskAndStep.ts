import Task from "@/types/Task"
import Utility from "@/lib/Utility"

export default function getCurrentTaskAndStep(tasks: Task[], date: Date) {
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]
        for (let i2 = 0; i2 < task.steps.length; i2++) {
            if (task.occurs === "once") {
                const step = task.steps[i2]
                if (!step.completed) {
                    return {
                        task,
                        step
                    }
                }
            }
            if (task.occurs === "repeating") {
                const step = task.steps[i2]
                const dateKey = Utility.getDateKey(date)
                const completed = Boolean(step.completions.find(completion => completion.date === dateKey))
                if (!completed) {
                    return {
                        task,
                        step
                    }
                }
            }
        }
    }
}