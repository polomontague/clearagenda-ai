"use client"
import { useContext, useState } from "react"
import List, { ListItem } from "@/components/List"
import Task from "@/types/Task"
import Card from "@/components/Card"
import { EditIcon, TrashCanIcon } from "@/components/Icons"
import LabelField from "@/components/LabelField"
import InnerValue from "@/components/InnerValue"
import FieldFrame from "@/components/FieldFrame"
import UserContext from "@/contexts/UserContext"
import Button from "../Button"
import TaskModal from "../TaskModal"
import Tasks from "@/lib/Tasks"
import FormModal from "../FormModal"
import TaskForm from "../TaskForm"
import TasksContext from "@/contexts/TasksContext"

type TaskListProps = {
    tasks: Task[]
}

export default function TaskList(props: TaskListProps) {
    const { updateTask } = useContext(TasksContext)
    const { user } = useContext(UserContext)
    const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined)
    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)

    const handleEditClick = (task: Task) => {
        setCurrentTask(task)
        setEditModalOpen(true)
    }

    const handleUpdateSuccess = (task: Task) => {
        updateTask(task)
        setEditModalOpen(false)
    }

    const handleTaskClick = (task: Task) => {
        setCurrentTask(task)
        setModalOpen(true)
    }

    if (!user) return

    return (
        <>
            <List>
                {props.tasks.map((task, i) => {
                    const status = Tasks.getStatus(task, user)
                    return (
                        <ListItem key={i}>
                            <Card
                                label={task.name}
                                buttons={[
                                    {
                                        icon: <EditIcon />,
                                        onClick: () => handleEditClick(task)
                                    },
                                    {
                                        icon: <TrashCanIcon />,
                                        onClick: () => {}
                                    }
                                ]}
                            >
                                <FieldFrame>
                                    <LabelField label="Length">
                                        <InnerValue label={Tasks.getLength(task)} />
                                    </LabelField>
                                    <LabelField label="Status">
                                        <InnerValue
                                            color={status.color}
                                            label={status.label}
                                        />
                                    </LabelField>
                                    <Button
                                        label="See Task"
                                        onClick={() => handleTaskClick(task)}
                                    />
                                </FieldFrame>
                            </Card>
                        </ListItem>
                    )
                })}
            </List>
            {currentTask ? (
                <>
                    <TaskModal
                        task={currentTask}
                        open={modalOpen}
                        onRequestClose={() => setModalOpen(false)}
                    />
                    <FormModal
                        label="Edit"
                        open={editModalOpen}
                        onRequestCancel={() => setEditModalOpen(false)}
                    >
                        <TaskForm
                            mode="edit"
                            task={currentTask}
                            onSuccess={handleUpdateSuccess}
                        />
                    </FormModal>
                </>
            ) : null}
        </>
    )
}