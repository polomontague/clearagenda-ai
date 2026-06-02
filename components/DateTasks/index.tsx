"use client"
import styles from "./DateTasks.module.css"
import { useContext, useMemo, useState, useEffect } from "react"
import TasksContext from "@/contexts/TasksContext"
import Tasks from "@/lib/Tasks"
import EventsContext from "@/contexts/EventsContext"
import UserContext from "@/contexts/UserContext"
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
import { CheckMarkIcon } from "../Icons"

export default function DateTasks({ date }: {
    date: Date
}) {
    const { tasks, updateCompleted, updateCompletion } = useContext(TasksContext)
    const { events } = useContext(EventsContext)
    const { user } = useContext(UserContext)
    const dateTasks = useMemo(() => {
        if (!user) return []
        return Tasks.getDateTasks(tasks, events, user, date)
    }, [tasks, events, user, date])
    const currentTaskAndStep = useMemo(() => Tasks.getCurrentTaskAndStep(dateTasks, date), [dateTasks])
    const [completeConfirmOpen, setCompleteConfirmOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [stopwatchSeconds, setStopwatchSeconds] = useState(0)
    const [stopwatchRunning, setStopwatchRunning] = useState(false)
    const allCompleted = dateTasks.every(task => task.steps.every(step => step.completed))
  
    const handleCompleteClick = () => {
        setCompleteConfirmOpen(true)
        setStopwatchRunning(false)
    }

    const handleCompleteConfirm = (task: TaskOccurrence, step: StepOccurrence) => {
        setCompleteConfirmOpen(false)
        const route = `/api/v1/tasks/${task.id}/steps/${step.id}/complete`
        const body = {
            date: task.occurs === "repeating" ? task.date : undefined
        }
        API.post<{ completed: string } | { completion: Completion }>(route, body, true).then(data => {
            setStopwatchSeconds(0)
            if ("completed" in data) {
                updateCompleted(task.id, step.id, data.completed)
            }
            if ("completion" in data) {
                updateCompletion(task.id, step.id, data.completion)
            }
            setAlertMessage(`"${step.name}" Marked Complete Successfully!`)
            setAlertOpen(true)
        }).catch(err => {
            setAlertMessage(err.message)
            setAlertOpen(true)
        })
    }

    return (
        <div className={styles.frame}>
            <div className={styles.column}>
                <FieldFrame>
                    {dateTasks.map(task => {
                        const current = currentTaskAndStep && currentTaskAndStep.task.id === task.id
                        return (
                            <Card key={task.id} label={task.name}>
                                <FieldFrame>
                                    <Fieldset label="Steps">
                                        {task.steps.map((step, i) => {
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
                                    <LabelField label="Length">
                                        <InnerValue label={Tasks.getLength(task)} />
                                    </LabelField>
                                    {current ? (
                                        <Fieldset>
                                            <LabelField fieldset label="Progress">
                                                <InnerValue label={Tasks.formatCompletion(task.completion)} />
                                            </LabelField>
                                            <Range fieldset value={task.completion} />
                                        </Fieldset>
                                    ) : <></>}
                                </FieldFrame>
                            </Card>
                        )
                    })}
                </FieldFrame>
            </div>
            <div className={styles.column}>
                {currentTaskAndStep ? (
                    <>
                        <Fieldset layer={2} label={currentTaskAndStep.task.name}>
                            <Card fieldset label={currentTaskAndStep.step.name}>
                                <FieldFrame>
                                    {currentTaskAndStep.step.notes ? (
                                        <Fieldset label="Notes">
                                            <ValueBox fieldset value={currentTaskAndStep.step.notes} />
                                        </Fieldset>
                                    ) : <></>}
                                    <LabelField label="Length">
                                        <InnerValue label={Utility.formatDuration(currentTaskAndStep.step.duration)} />
                                    </LabelField>
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
                            message={`Mark "${currentTaskAndStep.step.name}" Complete?`}
                            open={completeConfirmOpen}
                            onRequestCancel={() => setCompleteConfirmOpen(false)}
                            onRequestConfirm={() => handleCompleteConfirm(currentTaskAndStep.task, currentTaskAndStep.step)}

                        />
                    </>
                ) : null}
                {dateTasks.length && allCompleted ? (
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
            <Alert
                message={alertMessage}
                open={alertOpen}
                onRequestClose={() => setAlertOpen(false)}
            />
        </div>
    )
}