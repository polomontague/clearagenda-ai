"use client"
import { useState } from "react"
import ItemList from "@/components/ItemList"
import PageFrame from "@/components/PageFrame"

export default function MemoryPage() {
    const [tab, setTab] = useState("tasks")

    return (
        <PageFrame
            tabs={{
                options: [
                    { value: "tasks", label: "Tasks" },
                    { value: "events", label: "Events" }
                ],
                value: tab,
                onChange: setTab
            }}
        >
            <ItemList />
        </PageFrame>
    )
}