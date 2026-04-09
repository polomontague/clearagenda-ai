"use client"
import { useState } from "react"
import TaskList from "@/components/TaskList"
import SelectBar from "@/components/SelectBar"
import PrivateRoute from "@/components/PrivateRoute"
import PageFrame from "@/components/PageFrame"

export default function MemoryPage() {
    const [tab, setTab] = useState("tasks")

    return (
        <PrivateRoute>
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
                <TaskList />
            </PageFrame>
        </PrivateRoute>
    )
}