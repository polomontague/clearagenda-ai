"use client"
import { useContext, useState } from "react"
import List, { ListItem } from "@/components/List"
import Task from "@/types/Task"
import Card from "@/components/Card"
import { CheckMarkIcon, EditIcon, TrashCanIcon, WarningIcon } from "@/components/Icons"
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
import Fieldset from "../Fieldset"
import Utility from "@/lib/Utility"
import Confirm from "../Confirm"
import API from "@/lib/API"
import Alert from "../Alert"

type TaskListProps = {
    tasks: Task[]
}

export default function TaskList(props: TaskListProps) {
    const { replaceTask, removeTask } = useContext(TasksContext)
    const { user } = useContext(UserContext)
    const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined)
    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [alert, setAlert] = useState({ label: "", icon: <></>, message: "", open: false })

    const handleEditClick = (task: Task) => {
        setCurrentTask(task)
        setEditModalOpen(true)
    }

    const handleUpdateSuccess = (task: Task) => {
        replaceTask(task)
        setEditModalOpen(false)
    }

    const handleTaskClick = (task: Task) => {
        setCurrentTask(task)
        setModalOpen(true)
    }

    const handleDeleteClick = (task: Task) => {
        setCurrentTask(task)
        setDeleteConfirmOpen(true)
    }

    const handleDeleteConfirm = (task: Task) => {
        setDeleteConfirmOpen(false)
        API.delete<{ task: Task }>(`/api/v1/tasks/${task.id}`, true).then(data => {
            removeTask(data.task)
            setAlert({
                label: "Deleted",
                icon: <CheckMarkIcon />,
                message: data.task.name,
                open: true
            })
        }).catch(err => {
            setAlert({
                label: "Error",
                icon: <WarningIcon />,
                message: err.message,
                open: true
            })
        })
    }

    if (!user) return

    return (
        <>
            <List>
                {props.tasks.map(task => {
                    const status = Tasks.getStatus(task, user)
                    return (
                        <ListItem key={task.id}>
                            <Card
                                label={task.name}
                                buttons={[
                                    {
                                        icon: <EditIcon />,
                                        onClick: () => handleEditClick(task)
                                    },
                                    {
                                        icon: <TrashCanIcon />,
                                        onClick: () => handleDeleteClick(task)
                                    }
                                ]}
                            >
                                <FieldFrame>
                                    <Fieldset
                                        description={task.occurs === "repeating" ? Utility.getRepeatLabel(task.repeat) : undefined}
                                    >
                                        <LabelField fieldset label="Length">
                                            <InnerValue label={Tasks.getLength(task)} />
                                        </LabelField>
                                    </Fieldset>
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
                        label="Edit Task"
                        open={editModalOpen}
                        onRequestCancel={() => setEditModalOpen(false)}
                    >
                        <TaskForm
                            mode="edit"
                            task={currentTask}
                            onSuccess={handleUpdateSuccess}
                        />
                    </FormModal>
                    <Confirm
                        label="Delete Task"
                        icon={<TrashCanIcon />}
                        message={currentTask.name}
                        open={deleteConfirmOpen}
                        onRequestCancel={() => setDeleteConfirmOpen(false)}
                        onRequestConfirm={() => handleDeleteConfirm(currentTask)}
                    />
                </>
            ) : null}
            <Alert
                label={alert.label}
                icon={alert.icon}
                message={alert.message}
                open={alert.open}
                onRequestClose={() => setAlert({ ...alert, open: false })}
            />
        </>
    )
}