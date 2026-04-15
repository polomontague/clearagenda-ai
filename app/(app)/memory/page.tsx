"use client"
import { useState } from "react"
import ItemList from "@/components/ItemList"
import PageFrame from "@/components/PageFrame"
import SearchInput from "@/components/SearchInput"

export default function MemoryPage() {
    const [search, setSearch] = useState("")

    return (
        <PageFrame
            header={{
                center: (
                    <SearchInput
                        placeholder="Search..."
                        value={search}
                        onChange={(val) => setSearch(val)}
                    />
                )
            }}
        >
            <ItemList />
        </PageFrame>
    )
}