import { createContext, Dispatch, SetStateAction } from "react"
import Item from "@/types/Item"

const ItemsContext = createContext<{
    items: Item[],
    setItems: Dispatch<SetStateAction<Item[]>>
}>({
    items: [],
    setItems: () => {}
})

export default ItemsContext