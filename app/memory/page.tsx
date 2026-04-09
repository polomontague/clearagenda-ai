"use client"
import { useState } from "react"
import TaskList from "@/components/TaskList"
import SelectBar from "@/components/SelectBar"
import PrivateRoute from "@/components/PrivateRoute"

export default function MemoryPage() {
    const [tab, setTab] = useState("tasks")

    return (
        <PrivateRoute>
            <SelectBar
                options={[
                    { value: "tasks", label: "Tasks" },
                    { value: "events", label: "Events" }
                ]}
                value={tab}
                onChange={(val) => setTab(val)}
            />
            <TaskList />
        </PrivateRoute>
    )
}