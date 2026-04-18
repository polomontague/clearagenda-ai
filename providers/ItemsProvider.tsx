"use client"
import ItemsContext from "@/contexts/ItemsContext"
import { ReactNode, useState, useEffect } from "react"
import Item from "@/types/Item"
import API from "@/lib/API"

type ItemsProviderProps = {
    children: ReactNode
}

export default function ItemsProvider(props: ItemsProviderProps) {
    const [items, setItems] = useState<Item[]>([])

    useEffect(() => {
        API.get<{ items: Item[] }>("/api/v1/items", true).then(data => {
            setItems(data.items)
        })
    }, [])

    return (
        <ItemsContext.Provider value={{ items, setItems }}>
            {props.children}
        </ItemsContext.Provider>
    )
}