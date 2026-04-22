import prisma from "@/lib/prisma"
import Item, { Task, Step, Event } from "@/types/Item"
import assembleItem from "./assembleItem"
import itemsBaseQuery from "./itemsBaseQuery"

type TaskData = Pick<Task, "name" | "description" | "deadline" | "importance"> & {
    user_id: number,
    steps: Pick<Step, "name" | "notes" | "duration">[]
}

type EventData = Pick<Event, "name" | "notes" | "starts" | "ends" | "repeat"> & {
    user_id: number
}

type CreateItemData = TaskData | EventData

type GetItemsOptions = {
    user_id?: number
}

type UpdateItemData = Omit<TaskData, "user_id"> | Omit<EventData, "user_id">

const ItemsDAO = {
    createItem: async (data: CreateItemData) => {
        const result = await prisma.items.create({
            data: {
                user_id: data.user_id,
                name: data.name,
                description: "description" in data ? data.description : undefined,
                steps: "steps" in data ? {
                    create: data.steps.map(step => ({
                        name: step.name,
                        notes: step.notes,
                        duration: step.duration
                    }))
                } : undefined,
                deadline: "deadline" in data ? data.deadline : undefined,
                importance: "importance" in data ? data.importance : undefined,
                notes: "notes" in data ? data.notes : undefined,
                starts: "starts" in data ? data.starts : undefined,
                ends: "ends" in data ? data.ends : undefined,
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
                name: data.name,
                description: "description" in data ? data.description : undefined,
                steps: {
                    deleteMany: {},
                    create: "steps" in data ? data.steps.map(step => ({
                        name: step.name,
                        notes: step.notes,
                        duration: step.duration
                    })) : undefined
                },
                deadline: "deadline" in data ? data.deadline : undefined,
                importance: "importance" in data ? data.importance : undefined,
                notes: "notes" in data ? data.notes : undefined,
                starts: "starts" in data ? new Date(data.starts) : undefined,
                ends: "ends" in data ? new Date(data.ends) : undefined,
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