"use client"
import axios from "axios"
import { useState, useEffect } from "react"
import TaskList from "@/components/TaskList"
import SelectBar from "@/components/SelectBar"

export default function MemoryPage() {
    const [tab, setTab] = useState("tasks")

    return (
        <div>
            <SelectBar
                options={[
                    { value: "tasks", label: "Tasks" },
                    { value: "events", label: "Events" }
                ]}
                value={tab}
                onChange={(val) => setTab(val)}
            />
            <TaskList />
        </div>
    )
}