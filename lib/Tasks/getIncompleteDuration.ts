import Task from "@/types/Task"

export const getIncompleteDuration = (task: Task, dateAvailable: string): number => {
    if (task.occurs === "once") {
        return task.steps.reduce((total, step) => {
            return total + (step.completed ? 0 : step.duration)
        }, 0)
    } else { // Repeating
        return task.steps.reduce((total, step) => {
            const completion = step.completions.find(completion => completion.date === dateAvailable)
            return total + (completion ? 0 : step.duration)
        }, 0)
    }
}