import { Prisma } from "@/lib/prisma"
import stepCompletionsBaseQuery from "./stepCompletionsBaseQuery"
import { Completion } from "@/types/Task"

type StepCompletionResult = Prisma.task_step_completionsGetPayload<typeof stepCompletionsBaseQuery>

export default function assembleStepCompletion(result: StepCompletionResult): Completion {
    return {
        id: result.id,
        date: result.date,
        completed: result.completed.toISOString()
    }
}