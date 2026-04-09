"use client"
import { useState } from "react"
import FormModal from "@/components/FormModal"
import TaskForm from "@/components/TaskForm"
import SelectButton from "@/components/SelectButton"
import { PlusIcon } from "@/components/Icons"
import Task from "@/types/Task"
import PrivateRoute from "@/components/PrivateRoute"

export default function AgendaPage() {
    const [addTaskOpen, setAddTaskOpen] = useState(false)

    const handleAddTaskSuccess = (task: Task) => {
        setAddTaskOpen(false)
        console.log(task)
    }

    return (
        <PrivateRoute>
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
        </PrivateRoute>
    )
}