import styles from "./TaskList.module.css"
import Task from "@/types/Task"
import Card from "@/components/Card"
import ValueBox from "@/components/ValueBox"
import Confirm from "@/components/Confirm"
import { useState, useEffect, useContext } from "react"
import axios from "axios"
import Alert from "@/components/Alert"
import FormModal from "@/components/FormModal"
import TaskForm from "@/components/TaskForm"
import LabelField from "@/components/LabelField"
import FieldFrame from "@/components/FieldFrame"
import InnerButton from "@/components/InnerButton"
import { DownArrowIcon } from "@/components/Icons"
import Fieldset from "@/components/Fieldset"
import Utility from "@/lib/Utility"
import InnerValue from "@/components/InnerValue"
import UserContext from "@/contexts/UserContext"
import User from "@/types/User"

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [confirmMessage, setConfirmMessage] = useState("")
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [currentTask, setCurrentTask] = useState<Task | null>(null)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const { user } = useContext(UserContext)

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/tasks`).then(res => {
            setTasks(res.data.data.tasks)
        })
    }, [])

    const handleRequestEdit = (task: Task) => {
        setCurrentTask(task)
        setEditModalOpen(true)
    }

    const handleEditSuccess = (task: Task) => {
        setEditModalOpen(false)
        const newTasks = [ ...tasks ]
        const index = newTasks.findIndex(task2 => task2.id === task.id)
        newTasks[index] = task
        setTasks(newTasks)
        setAlertMessage(`"${task.name}" Updated Successfully`)
        setAlertOpen(true)
    }

    const handleRequestDelete = (task: Task) => {
        setCurrentTask(task)
        setConfirmMessage(`Delete "${task.name}"?`)
        setConfirmOpen(true)
    }

    const handleDeleteConfirm = () => {
        setConfirmOpen(false)
        axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/tasks/${currentTask?.id}`).then(res => {
            const newTasks = tasks.filter(task => task.id !== currentTask?.id)
            setTasks(newTasks)
            setAlertMessage(`"${currentTask?.name}" Deleted Successfully`)
            setAlertOpen(true)
        }).catch(err => {
            setAlertMessage(err.response.data.error.message)
            setAlertOpen(true)
        })
    }

    const getDuration = (task: Task) => {
        if (task.type === "simple") return task.duration
        let duration = 0
        task.steps.forEach(step => duration += step.duration)
        return duration
    }

    const averageHours = (user: User) => {
        let total = 0
        Object.keys(user.preferences.hours).forEach((key) => {
            total += user.preferences.hours[key as "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"]
        })
        return total / 7
    }

    if (!user) return

    return (
        <div>
            <ul className={styles.lstTasks}>
                {tasks.map((task, i) => (
                    <li key={i}>
                        <Card
                            label={task.name}
                            onRequestEdit={() => handleRequestEdit(task)}
                            onRequestDelete={() => handleRequestDelete(task)}
                        >
                            <FieldFrame>
                                 {task.type === "simple" ? (
                                    <>
                                        {task.notes ? (
                                            <Fieldset label="Notes">
                                                <ValueBox fieldset value={task.notes} />
                                            </Fieldset>
                                        ) : null}
                                    </>
                                ) : task.type === "complex" ? (
                                    <>
                                        <Fieldset label="Description">
                                            <ValueBox fieldset value={task.description} />
                                        </Fieldset>
                                        <LabelField label="Steps">
                                            <InnerButton
                                                icon={<DownArrowIcon />}
                                                label={`${task.steps.length} Steps`}
                                            />
                                        </LabelField>
                                    </>
                                ) : <></>}
                                <LabelField label="Duration">
                                    <InnerValue label={Utility.formatTime(getDuration(task), averageHours(user))} />
                                </LabelField>
                            </FieldFrame>
                        </Card>
                    </li>
                ))}
            </ul>
            <FormModal
                label="Edit Task"
                open={editModalOpen}
                onRequestCancel={() => setEditModalOpen(false)}
            >
                {currentTask ? (
                    <TaskForm
                        type="edit"
                        task={currentTask}
                        onSuccess={handleEditSuccess}
                    />
                ) : null}
            </FormModal>
            <Confirm
                message={confirmMessage}
                open={confirmOpen}
                onRequestCancel={() => setConfirmOpen(false)}
                onRequestConfirm={handleDeleteConfirm}
            />
            <Alert
                message={alertMessage}
                open={alertOpen}
                onRequestClose={() => setAlertOpen(false)}
            />
        </div>
    )
}