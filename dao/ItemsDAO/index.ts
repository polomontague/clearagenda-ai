import prisma from "@/lib/prisma"
import { Step, OnceTask, RepeatingTask, OnceEvent, RepeatingEvent } from "@/types/Item"
import assembleItem from "./assembleItem"
import itemsBaseQuery from "./itemsBaseQuery"

type OnceTaskData = Pick<OnceTask, "type" | "name" | "description" | "importance" | "occurs" | "deadline"> & {
    user_id: number,
    steps: Pick<Step, "name" | "notes" | "duration">[]
}
type RepeatingTaskData = Pick<RepeatingTask, "type" | "name" | "description" | "importance" | "occurs" | "repeat"> & {
    user_id: number,
    steps: Pick<Step, "name" | "notes" | "duration">[]
}
type TaskData = OnceTaskData | RepeatingTaskData
type OnceEventData = Pick<OnceEvent, "type" | "name" | "notes" | "starts" | "duration" | "occurs"> & {
    user_id: number
}
type RepeatingEventData = Pick<RepeatingEvent, "type" | "name" | "notes" | "starts" | "duration" | "occurs" | "repeat"> & {
    user_id: number
}
type EventData = OnceEventData | RepeatingEventData
type CreateItemData = TaskData | EventData

type GetItemsOptions = {
    user_id?: number
}

type UpdateItemData = Omit<OnceTaskData, "user_id"> | Omit<RepeatingTaskData, "user_id"> | Omit<OnceEventData, "user_id"> | Omit<RepeatingEventData, "user_id">

const ItemsDAO = {
    createItem: async (data: CreateItemData) => {
        const result = await prisma.items.create({
            data: {
                user_id: data.user_id,
                type: data.type,
                name: data.name,
                description: "description" in data ? data.description : undefined,
                steps: "steps" in data ? {
                    create: data.steps.map(step => ({
                        name: step.name,
                        notes: step.notes,
                        duration: step.duration
                    }))
                } : undefined,
                importance: "importance" in data ? data.importance : undefined,
                notes: "notes" in data ? data.notes : undefined,
                starts: "starts" in data ? data.starts : undefined,
                duration: "duration" in data ? data.duration : undefined,
                occurs: data.occurs,
                deadline: "deadline" in data ? data.deadline : undefined,
                repeat: "repeat" in data ? data.repeat : undefined
            },
            ...itemsBaseQuery
        })
        return assembleItem(result)
    },
    getItems: async (options: GetItemsOptions) => {
        const result = await prisma.items.findMany({
            where: {
                user_id: options.user_id
            },
            orderBy: [
                { occurs: "desc" },
                { deadline: "asc" },
                { importance: "desc" }
            ],
            ...itemsBaseQuery
        })
        return result.map(result => assembleItem(result))
    },
    getItemById: async (itemId: number) => {
        const result = await prisma.items.findUnique({
            where: {
                id: itemId
            },
            ...itemsBaseQuery
        })
        return result ? assembleItem(result) : undefined
    },
    updateItem: async (itemId: number, data: UpdateItemData) => {
        const result = await prisma.items.update({
            where: {
                id: itemId
            },
            data: {
                type: data.type,
                name: data.name,
                description: "description" in data ? data.description : undefined,
                steps: "steps" in data ? {
                    deleteMany: {},
                    create: data.steps.map(step => ({
                        name: step.name,
                        notes: step.notes,
                        duration: step.duration
                    }))
                } : undefined,
                importance: "importance" in data ? data.importance : undefined,
                notes: "notes" in data ? data.notes : undefined,
                starts: "starts" in data ? data.starts : undefined,
                duration: "duration" in data ? data.duration : undefined,
                occurs: data.occurs,
                deadline: "deadline" in data ? data.deadline : undefined,
                repeat: "repeat" in data ? data.repeat : undefined
            },
            ...itemsBaseQuery
        })
        return assembleItem(result)
    },
    deleteItem: async (itemId: number) => {
        const result = await prisma.items.delete({
            where: {
                id: itemId
            },
            ...itemsBaseQuery
        })
        return assembleItem(result)
    },
    updateCompleted: async (stepId: number, data?: Date) => {
        await prisma.item_steps.update({
            where: {
                id: stepId
            },
            data: {
                completed: data ? data : null
            }
        })
        return data?.toISOString()
    }
}

export default ItemsDAO