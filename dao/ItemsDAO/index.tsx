import prisma from "@/lib/prisma"
import Item, { Step } from "@/types/Item"

type ItemData = Pick<Item, "name" | "description" | "deadline" | "importance"> & {
    user_id: number,
    steps: Pick<Step, "name" | "notes" | "duration">[]
}

const ItemsDAO = {
    createItem: async (data: ItemData): Promise<Item> => {
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
            }
        })
    }
}

export default ItemsDAO