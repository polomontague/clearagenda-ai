"use client"
import { useState } from "react"
import FormModal from "@/components/FormModal"
import TaskForm from "@/components/TaskForm"
import SelectButton from "@/components/SelectButton"
import { PlusIcon } from "@/components/Icons"
import Task from "@/types/Task"
import PageFrame from "@/components/PageFrame"
import Agenda from "@/components/Agenda"

export default function AgendaPage() {
    const [tab, setTab] = useState<"today" | "tomorrow">("today")
    const [addTaskOpen, setAddTaskOpen] = useState(false)

    const handleAddTaskSuccess = (task: Task) => {
        setAddTaskOpen(false)
        console.log(task)
    }

    return (
        <PageFrame
            tabs={{
                options: [
                    { value: "today", label: "Today" },
                    { value: "tomorrow", label: "Tomorrow" }
                ],
                value: tab,
                onChange: setTab
            }}
        >
            <Agenda day={tab} />
            <SelectButton
                icon={<PlusIcon />}
                options={[
                    {
                        icon: <PlusIcon />,
                        label: "Task",
                        onClick: () => setAddTaskOpen(true)
                    },
                    {
                        icon: <PlusIcon />,
                        label: "Event",
                        onClick: () => {}
                    }
                ]}
            />
            <FormModal
                open={addTaskOpen}
                label="Add Task"
                onRequestCancel={() => setAddTaskOpen(false)}
            >
                <TaskForm type="new" onSuccess={handleAddTaskSuccess} />
            </FormModal>
        </PageFrame>
    )
}