import { Prisma } from "@/lib/prisma"
import itemsBaseQuery from "./itemsBaseQuery"
import Item from "@/types/Item"
import assembleSimpleUser from "../UsersDAO/assembleSimpleUser"
import { Repeat } from "@/types/Item"

type ItemResult = Prisma.itemsGetPayload<typeof itemsBaseQuery>

const assembleItem = (result: ItemResult): Item => {
    const urgency = calculateUrgency(result.deadline)
    return result.description ? {
        type: "task",
        id: result.id,
        user: assembleSimpleUser(result.user),
        name: result.name,
        description: result.description,
        steps: result.steps.map(step => ({
            id: step.id,
            name: step.name,
            notes: step.notes,
            duration: step.duration,
            completed: step.completed ? step.completed.toISOString() : undefined
        })),
        deadline: result.deadline ? result.deadline.toISOString() : undefined,
        urgency,
        importance: result.importance!,
        priority: calculatePriority(urgency, result.importance!),
        created: result.created.toISOString(),
        updated: result.updated.toISOString()
    } : {
        type: "event",
        id: result.id,
        user: assembleSimpleUser(result.user),
        name: result.name,
        notes: result.notes ? result.notes : undefined,
        starts: result.starts!.toISOString(),
        ends: result.ends!.toISOString(),
        repeat: result.repeat ? result.repeat as Repeat : undefined,
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
    // differenceDays is negative → closer to 0 = closer to today
    const normalized = 1 + differenceDays / lookaheadDays // ranges 0 to ~1
    const urgency = Math.max(0, Math.min(1, normalized)) // clamp between 0-1
    return Math.round(urgency * 100) / 100 // round to hundreths place
}

const calculatePriority = (urgency: number, importance: number) => {
    return Math.round((urgency + (importance * (1 - urgency))) * 100) / 100 // round to hundreths place
}

export default assembleItem