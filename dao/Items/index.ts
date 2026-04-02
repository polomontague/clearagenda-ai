import prisma from "@/lib/prisma"
import itemBaseQuery from "./itemBaseQuery"

const ItemsDAO = {
    getItemById: async (itemId: number) => {
        const result = await prisma.items.findUnique({
            where: {
                id: itemId
            },
            ...itemBaseQuery
        })
        console.log(result)
    }
}

export default ItemsDAO