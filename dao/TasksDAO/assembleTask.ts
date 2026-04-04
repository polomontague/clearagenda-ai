import { Prisma } from "@/lib/prisma"
import taskBaseQuery from "./taskBaseQuery"
import Task from "@/types/Task"

type TaskResult = Prisma.tasksGetPayload<typeof taskBaseQuery>

const assembleTask = (result: TaskResult): Task => {
    return result.description ? {
        type: "complex",
        id: result.id,
        name: result.name,
        description: result.description,
        steps: result.steps.map(step => ({
            id: step.id,
            name: step.name,
            notes: step.notes,
            duration: step.duration
        })),
        created: result.created.toISOString(),
        updated: result.updated.toISOString()
    } : {
        type: "simple",
        id: result.id,
        name: result.name,
        notes: result.notes ?? undefined,
        created: result.created.toISOString(),
        updated: result.updated.toISOString()
    }
}

export default assembleTask