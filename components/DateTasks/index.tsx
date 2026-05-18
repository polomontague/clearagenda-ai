"use client"
import { useContext, useMemo } from "react"
import TasksContext from "@/contexts/TasksContext"
import Tasks from "@/lib/Tasks"
import EventsContext from "@/contexts/EventsContext"
import UserContext from "@/contexts/UserContext"
import FieldFrame from "../FieldFrame"
import Card from "../Card"
import Fieldset from "../Fieldset"
import LabelField from "../LabelField"
import Task, { Step } from "@/types/Task"

export default function DateTasks({ date }: {
    date: Date
}) {
    const { tasks } = useContext(TasksContext)
    const { events } = useContext(EventsContext)
    const { user } = useContext(UserContext)
    if (!user) return
    const dateTasks = useMemo(() => Tasks.getDateTasks(tasks, events, user, date), [tasks, date])
    const currentTaskAndStep = useMemo(() => Tasks.getCurrentTaskAndStep(dateTasks, date), [dateTasks])

    const renderCurrentStep = (task: Task, step: Step) => {
        return (
            <Card fieldset label={step.name}>
                Current Step
            </Card>
        )
    }

    return (
        <>
            <FieldFrame>
                {dateTasks.map((task, i) => {
                    return (
                        <Card key={i} label={task.name}>
                            <Fieldset label="Steps">
                                {task.steps.map((step, i) => {
                                    const current = currentTaskAndStep && currentTaskAndStep.task.id === task.id && currentTaskAndStep.step.id === step.id
                                    return current ? renderCurrentStep(currentTaskAndStep.task, currentTaskAndStep.step) : (
                                        <LabelField
                                            fieldset
                                            label={step.name}
                                        >

                                        </LabelField>
                                    )
                                })}
                            </Fieldset>
                        </Card>
                    )
                })}
            </FieldFrame>
        </>
    )
}