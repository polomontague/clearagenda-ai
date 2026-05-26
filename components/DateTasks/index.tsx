"use client"
import styles from "./DateTasks.module.css"
import { useContext, useMemo } from "react"
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

export default function DateTasks({ date }: {
    date: Date
}) {
    const { tasks } = useContext(TasksContext)
    const { events } = useContext(EventsContext)
    const { user } = useContext(UserContext)
    const dateTasks = useMemo(() => {
        if (!user) return []
        return Tasks.getDateTasks(tasks, events, user, date)
    }, [tasks, events, user, date])
    const currentTaskAndStep = useMemo(() => Tasks.getCurrentTaskAndStep(dateTasks, date), [dateTasks])

   
    return (
        <div className={styles.frame}>
            <div>
                <FieldFrame>
                    {dateTasks.map((task, i) => {
                        const current = currentTaskAndStep && currentTaskAndStep.task.id === task.id
                        return (
                            <Card key={i} label={task.name}>
                                <FieldFrame>
                                    <Fieldset label="Steps">
                                        {task.steps.map((step, i) => {
                                            return (
                                                <LabelField
                                                    fieldset
                                                    label={step.name}
                                                />
                                            )
                                        })}
                                    </Fieldset>
                                    {current ? (
                                        <Fieldset>
                                            <LabelField fieldset label="Completion">
                                                <InnerValue label={`${task.completion * 100}%`} />
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
            <div>
                {currentTaskAndStep ? (
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
                                <Button label="Mark Complete" />
                            </FieldFrame>
                        </Card>
                    </Fieldset>
                ) : null}
            </div>
        </div>
    )
}