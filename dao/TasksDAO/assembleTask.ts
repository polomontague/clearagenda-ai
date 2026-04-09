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
        deadline: result.deadline ? result.deadline.toISOString() : undefined,
        urgency: calculateUrgency(result.deadline),
        importance: result.importance,
        priority: calculatePriority(calculateUrgency(result.deadline), result.importance),
        created: result.created.toISOString(),
        updated: result.updated.toISOString()
    } : {
        type: "simple",
        id: result.id,
        name: result.name,
        notes: result.notes ?? undefined,
        duration: result.duration!,
        deadline: result.deadline ? result.deadline.toISOString() : undefined,
        urgency: calculateUrgency(result.deadline),
        importance: result.importance,
        priority: calculatePriority(calculateUrgency(result.deadline), result.importance),
        created: result.created.toISOString(),
        updated: result.updated.toISOString()
    }
}

const calculateUrgency = (deadline: Date | null) => {
    if (!deadline) return 0
    const today = new Date()
    const differenceDays = (today.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24) // 1 day in milliseconds
    if (differenceDays >= 0) return 1 // return 1 if deadline is today of in the past
    const lookaheadDays = 30
    // diffDays is negative → closer to 0 = closer to today
    const normalized = 1 + differenceDays / lookaheadDays // ranges 0 to ~1
    const urgency = Math.max(0, Math.min(1, normalized)) // clamp between 0-1
    return Math.round(urgency * 100) / 100 // round to hundreths place
}

const calculatePriority = (urgency: number, importance: number) => {
    return urgency + (importance * (1 - urgency))
}

export default assembleTask