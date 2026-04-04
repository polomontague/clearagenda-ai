"use client"
import { useState } from "react"
import Modal from "@/components/Modal"
import TaskForm from "@/components/TaskForm"
import SelectButton from "@/components/SelectButton"
import { PlusIcon } from "@/components/Icons"
import Task from "@/types/Task"

export default function Calendar() {
    const [addTaskOpen, setAddTaskOpen] = useState(false)

    const handleAddTaskSuccess = (task: Task) => {
        setAddTaskOpen(false)
        console.log(task)
    }

    return (
        <div>
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
            <Modal
                open={addTaskOpen}
                label="Add Task"
                onRequestCancel={() => setAddTaskOpen(false)}
                onRequestDone={() => {}}
            >
                <TaskForm type="new" onSuccess={handleAddTaskSuccess} />
            </Modal>
        </div>
    )
}