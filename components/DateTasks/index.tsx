"use client"
import styles from "./DateTasks.module.css"
import { useContext, useMemo, useState } from "react"
import TasksContext from "@/contexts/TasksContext"
import Tasks from "@/lib/Tasks"
import FieldFrame from "../FieldFrame"
import Card from "../Card"
import Fieldset from "../Fieldset"
import LabelField from "../LabelField"
import ValueBox from "../ValueBox"
import Button from "../Button"
import InnerValue from "../InnerValue"
import Utility from "@/lib/Utility"
import Range from "../Range"
import Confirm from "../Confirm"
import Alert from "../Alert"
import { Completion, StepOccurrence, TaskOccurrence } from "@/types/Task"
import API from "@/lib/API"
import Stopwatch from "../Stopwatch"
import EmptyState from "../EmptyState"
import { CheckMarkIcon, EditIcon, TrashCanIcon } from "../Icons"
import Task from "@/types/Task"
import TaskModal from "../TaskModal"
import FormModal from "../FormModal"
import TaskForm from "../TaskForm"
import User from "@/types/User"
import UserContext from "@/contexts/UserContext"

export default function DateTasks({ tasks, day }: {
    tasks: TaskOccurrence[],
    day: Date
}) {
    const { updateCompleted, updateCompletion, replaceTask, removeTask } = useContext(TasksContext)
    const currentOccurrenceAndStep = useMemo(() => Tasks.getCurrentOccurrenceAndStep(tasks), [tasks])
    const [completeConfirmOpen, setCompleteConfirmOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [stopwatchSeconds, setStopwatchSeconds] = useState(0)
    const [stopwatchRunning, setStopwatchRunning] = useState(false)
    const allCompleted = tasks.every(task => task.steps.every(step => step.completed))
    const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [taskModalOpen, setTaskModalOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const { user } = useContext(UserContext)
    const currentOccurrenceDeadline = useMemo(() => {
        if (!currentOccurrenceAndStep || !user) return undefined
        const deadline = currentOccurrenceAndStep.occurrence.effective_deadline
        return deadline ? getDeadline(deadline, user) : undefined
    }, [currentOccurrenceAndStep, user])
  
    const handleEditClick = (task: Task) => {
        setCurrentTask(task)
        setEditModalOpen(true)
    }

    const handleUpdateSuccess = (task: Task) => {
        replaceTask(task)
        setEditModalOpen(false)
    }

    const handleDeleteClick = (task: Task) => {
        setCurrentTask(task)
        setDeleteConfirmOpen(true)
    }

    const handleDeleteConfirm = (task: Task) => {
        setDeleteConfirmOpen(false)
        API.delete<{ task: Task }>(`/api/v1/tasks/${task.id}`, true).then(data => {
            removeTask(data.task)
            setAlertMessage(`"${data.task.name}" Deleted Successfully!`)
            setAlertOpen(true)
        }).catch(err => {
            setAlertMessage(err.message)
            setAlertOpen(true)
        })
    }

    const handleTaskClick = (task: Task) => {
        setCurrentTask(task)
        setTaskModalOpen(true)
    }

    const handleCompleteClick = () => {
        setCompleteConfirmOpen(true)
        setStopwatchRunning(false)
    }

    const handleCompleteConfirm = (occurrence: TaskOccurrence, step: StepOccurrence) => {
        setCompleteConfirmOpen(false)
        const route = `/api/v1/tasks/${occurrence.task.id}/steps/${step.id}/complete`
        const body = {
            date: occurrence.task.occurs === "repeating" ? occurrence.date_available : undefined
        }
        API.post<{ completed: string } | { completion: Completion }>(route, body, true).then(data => {
            setStopwatchSeconds(0)
            if ("completed" in data) {
                updateCompleted(occurrence.task.id, step.id, data.completed)
            }
            if ("completion" in data) {
                updateCompletion(occurrence.task.id, step.id, data.completion)
            }
            setAlertMessage(`"${step.name}" Marked Complete Successfully!`)
            setAlertOpen(true)
        }).catch(err => {
            setAlertMessage(err.message)
            setAlertOpen(true)
        })
    }

    function getDeadline(deadline: string, user: User): {
        color: string,
        label: string
    } {
        const accent = user.preferences.accent
        const COLORS = {
            red: accent === "red" ? "var(--coral)" : "var(--red)",
            yellow: accent === "yellow" ? "var(--orange)" : "var(--yellow)",
            green: accent === "green" ? "var(--mint)" : "var(--green)",
        }
        const deadlineDate = Utility.loadLocalDate(deadline)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000
        const todayKey = Utility.getDateKey(today)
        if (deadline === todayKey) return {
            color: COLORS.yellow,
            label: "Due Today"
        }
        if (todayKey < deadline) { // deadline is in the future
            const daysInFuture = Math.ceil((deadlineDate.getTime() - today.getTime()) / MILLISECONDS_PER_DAY)
            return {
                color: COLORS.green,
                label: `In ${daysInFuture} ${daysInFuture === 1 ? "Day" : "Days"}`
            }
        } else { // deadline is in the past
            const daysOverdue = Math.max(0, Math.floor((today.getTime() - deadlineDate.getTime()) / MILLISECONDS_PER_DAY))
            return {
                color: COLORS.red,
                label: `${daysOverdue} ${daysOverdue === 1 ? "Day" : "Days"} Overdue`
            }
        }
    }

    return (
        <div className={styles.frame}>
            <div className={styles.column}>
                <FieldFrame>
                    {tasks.map(occurrence => {
                        const current = currentOccurrenceAndStep && currentOccurrenceAndStep.occurrence.task.id === occurrence.task.id
                        const deadline = occurrence.effective_deadline && user ? getDeadline(occurrence.effective_deadline, user) : undefined
                        return (
                            <Card
                                key={`${occurrence.task.id}:${occurrence.date_available}`}
                                label={occurrence.task.name}
                                buttons={[
                                    {
                                        icon: <EditIcon />,
                                        onClick: () => handleEditClick(occurrence.task)
                                    },
                                    {
                                        icon: <TrashCanIcon />,
                                        onClick: () => handleDeleteClick(occurrence.task)
                                    }
                                ]}
                            >
                                <FieldFrame>
                                    <Fieldset label="Steps">
                                        {occurrence.steps.map(step => {
                                            return (
                                                <LabelField
                                                    key={step.id}
                                                    fieldset
                                                    strike={Boolean(step.completed)}
                                                    label={step.name}
                                                />
                                            )
                                        })}
                                    </Fieldset>
                                    <Fieldset>
                                        <LabelField fieldset label="Length">
                                            <InnerValue label={Tasks.getLength(occurrence.task)} />
                                        </LabelField>
                                        {deadline ? (
                                            <LabelField fieldset label="Deadline">
                                                <InnerValue color={deadline.color} label={deadline.label} />
                                            </LabelField>
                                        ) : <></>}
                                    </Fieldset>
                                    {current ? (
                                        <Fieldset>
                                            <LabelField fieldset label="Progress">
                                                <InnerValue label={Tasks.formatCompletion(occurrence.completion)} />
                                            </LabelField>
                                            <Range fieldset value={occurrence.completion} />
                                        </Fieldset>
                                    ) : <></>}
                                    <Button
                                        label="See Task"
                                        onClick={() => handleTaskClick(occurrence.task)}
                                    />
                                </FieldFrame>
                            </Card>
                        )
                    })}
                </FieldFrame>
            </div>
            <div className={styles.column}>
                {currentOccurrenceAndStep ? (
                    <>
                        <Fieldset layer={2} label={currentOccurrenceAndStep.occurrence.task.name}>
                            <Card fieldset label={currentOccurrenceAndStep.step.name}>
                                <FieldFrame>
                                    {currentOccurrenceAndStep.step.notes ? (
                                        <Fieldset label="Notes">
                                            <ValueBox fieldset value={currentOccurrenceAndStep.step.notes} />
                                        </Fieldset>
                                    ) : <></>}
                                    <Fieldset>
                                        <LabelField fieldset label="Length">
                                            <InnerValue label={Utility.formatDuration(currentOccurrenceAndStep.step.duration)} />
                                        </LabelField>
                                        {currentOccurrenceDeadline ? (
                                            <LabelField fieldset label="Deadline">
                                                <InnerValue
                                                    color={currentOccurrenceDeadline.color}
                                                    label={currentOccurrenceDeadline.label}
                                                />
                                            </LabelField>
                                        ) : <></>}
                                    </Fieldset>
                                    <Fieldset
                                        label="Stopwatch"
                                        description="Optionally track how long this step takes."
                                    >
                                        <Stopwatch
                                            fieldset
                                            value={stopwatchSeconds}
                                            onChange={setStopwatchSeconds}
                                            running={stopwatchRunning}
                                            onRunningChange={setStopwatchRunning}
                                        />
                                    </Fieldset>
                                    <Button
                                        label="Mark Complete"
                                        onClick={handleCompleteClick}
                                    />
                                </FieldFrame>
                            </Card>
                        </Fieldset>
                        <Confirm
                            message={`Mark "${currentOccurrenceAndStep.step.name}" Complete?`}
                            open={completeConfirmOpen}
                            onRequestCancel={() => setCompleteConfirmOpen(false)}
                            onRequestConfirm={() => handleCompleteConfirm(currentOccurrenceAndStep.occurrence, currentOccurrenceAndStep.step)}

                        />
                    </>
                ) : null}
                {tasks.length && allCompleted ? (
                    <EmptyState
                        icon={<CheckMarkIcon />}
                        message="All Done For Today!"
                        button={{
                            type: "button",
                            label: "Next Task",
                            onClick: () => {}
                        }}
                    />
                ) : null}
            </div>
            {currentTask ? (
                <>
                    <TaskModal
                        task={currentTask}
                        open={taskModalOpen}
                        onRequestClose={() => setTaskModalOpen(false)}
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
                        message={`Delete "${currentTask.name}"?`}
                        open={deleteConfirmOpen}
                        onRequestCancel={() => setDeleteConfirmOpen(false)}
                        onRequestConfirm={() => handleDeleteConfirm(currentTask)}
                    />
                </>
            ) : null}
            <Alert
                message={alertMessage}
                open={alertOpen}
                onRequestClose={() => setAlertOpen(false)}
            />
        </div>
    )
}