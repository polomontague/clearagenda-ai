import prisma from "@/lib/prisma"
import Item, { Step } from "@/types/Item"
import assembleItem from "./assembleItem"
import itemsBaseQuery from "./itemsBaseQuery"

type CreateItemData = Pick<Item, "name" | "description" | "deadline" | "importance"> & {
    user_id: number,
    steps: Pick<Step, "name" | "notes" | "duration">[]
}

type GetItemsOptions = {
    user_id?: number
}

type UpdateItemData = Omit<CreateItemData, "user_id">

const ItemsDAO = {
    createItem: async (data: CreateItemData) => {
        const result = await prisma.items.create({
            data: {
                user_id: data.user_id,
                name: data.name,
                description: data.description,
                steps: {
                    create: data.steps.map(step => ({
                        name: step.name,
                        notes: step.notes,
                        duration: step.duration
                    }))
                },
                deadline: data.deadline,
                importance: data.importance
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
                description: data.description,
                steps: {
                    deleteMany: {},
                    create: data.steps.map(step => ({
                        name: step.name,
                        notes: step.notes,
                        duration: step.duration
                    }))
                },
                deadline: data.deadline,
                importance: data.importance
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
    updateCompleted: async (stepId: number) => {
        const completed = new Date()
        await prisma.item_steps.update({
            where: {
                id: stepId
            },
            data: {
                completed
            }
        })
        return completed.toISOString()
    }
}

export default ItemsDAO