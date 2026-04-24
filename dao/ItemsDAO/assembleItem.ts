import { Prisma } from "@/lib/prisma"
import itemsBaseQuery from "./itemsBaseQuery"
import Item, { Repeat } from "@/types/Item"
import assembleSimpleUser from "../UsersDAO/assembleSimpleUser"

type ItemResult = Prisma.itemsGetPayload<typeof itemsBaseQuery>

const assembleItem = (result: ItemResult): Item => {
    return result.type === "task" ? (
        result.occurs === "once" ? {
            type: "task",
            id: result.id,
            user: assembleSimpleUser(result.user),
            name: result.name,
            description: result.description ?? "",
            steps: result.steps.map(step => ({
                id: step.id,
                name: step.name,
                notes: step.notes,
                duration: step.duration,
                completed: step.completed?.toISOString()
            })),
            importance: result.importance ?? 0,
            occurs: "once",
            deadline: result.deadline?.toISOString(),
            created: result.created.toISOString(),
            updated: result.updated.toISOString()
        } : { // Repeating
            type: "task",
            id: result.id,
            user: assembleSimpleUser(result.user),
            name: result.name,
            description: result.description ?? "",
            steps: result.steps.map(step => ({
                id: step.id,
                name: step.name,
                notes: step.notes,
                duration: step.duration,
                completed: step.completed?.toISOString()
            })),
            importance: result.importance ?? 0,
            occurs: "repeating",
            repeat: result.repeat as Repeat,
            created: result.created.toISOString(),
            updated: result.updated.toISOString()
        }
    ) : ( // Type: Event
        result.occurs === "once" ? {
            type: "event",
            id: result.id,
            user: assembleSimpleUser(result.user),
            name: result.name,
            notes: result.notes ?? undefined,
            duration: result.duration ?? 0,
            occurs: "once",
            starts: result.starts?.toISOString() ?? "",
            created: result.created.toISOString(),
            updated: result.updated.toISOString()
        } : { // Repeating
            type: "event",
            id: result.id,
            user: assembleSimpleUser(result.user),
            name: result.name,
            notes: result.notes ?? undefined,
            duration: result.duration ?? 0,
            occurs: "repeating",
            starts: result.starts?.toISOString() ?? "",
            repeat: result.repeat as Repeat,
            created: result.created.toISOString(),
            updated: result.updated.toISOString()
        }
    )
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