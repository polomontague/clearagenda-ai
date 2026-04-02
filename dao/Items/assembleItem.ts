import { Prisma } from "@/lib/prisma"
import itemBaseQuery from "./itemBaseQuery"
import Item from "@/types/Item"

type ItemResult = Prisma.itemsGetPayload<typeof itemBaseQuery>

const assembleItem = (result: ItemResult): Item => {
    return {
        id: result.id,
        name: result.name,
        duration: result.duration
    }
}