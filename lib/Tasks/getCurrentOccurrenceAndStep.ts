import { TaskOccurrence } from "@/types/Task"

export const getCurrentOccurrenceAndStep = (occurrences: TaskOccurrence[]) => {
    for (let i = 0; i < occurrences.length; i++) {
        const occurrence = occurrences[i]
        for (let i2 = 0; i2 < occurrence.steps.length; i2++) {
            const step = occurrence.steps[i2]
            if (!step.completed) {
                return {
                    occurrence,
                    step
                }
            }
        }
    }
}