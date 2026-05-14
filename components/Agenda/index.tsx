"use client"
import styles from "./Agenda.module.css"
import { useState, useContext, useEffect, useMemo } from "react"
import Card from "@/components/Card"
import FieldFrame from "@/components/FieldFrame"
import LabelField from "@/components/LabelField"
import Fieldset from "@/components/Fieldset"
import InnerValue from "@/components/InnerValue"
import Utility from "@/lib/Utility"
import ValueBox from "@/components/ValueBox"
import Button from "@/components/Button"
import Confirm from "@/components/Confirm"
import API from "@/lib/API"
import Alert from "@/components/Alert"
import UserContext from "@/contexts/UserContext"
import Columns from "@/components/Columns"
import Range from "@/components/Range"
import Task, { Step } from "@/types/Task"
import TasksContext from "@/contexts/TasksContext"
import EventsContext from "@/contexts/EventsContext"
import RemindersContext from "@/contexts/RemindersContext"
import Event from "@/types/Event"
import Reminder from "@/types/Reminder"
import getDateReminders from "./getDateReminders"
import getDateEvents from "./getDateEvents"
import getDateTasks from "./getDateTasks"
import Timeline from "@/components/Timeline"
import getCurrentTaskAndStep from "./getCurrentTaskAndStep"
import DateCard from "@/components/DateCard"

type AgendaProps = {
    date: Date
}

export default function Agenda(props: AgendaProps) {
    const [confirmMessage, setConfirmMessage] = useState("")
    const [confirmOpen, setConfirmOpen ] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const { user } = useContext(UserContext)
    const today = props.date.toLocaleDateString("en-CA") === new Date().toLocaleDateString("en-CA")
    const { tasks } = useContext(TasksContext)
    const { events } = useContext(EventsContext)
    const { reminders } = useContext(RemindersContext)
    const [dateTasks, setDateTasks] = useState<Task[]>([])
    const [dateEvents, setDateEvents] = useState<Event[]>([])
    const [dateReminders, setDateReminders] = useState<Reminder[]>([])
    const currentTaskAndStep = useMemo(() => getCurrentTaskAndStep(dateTasks, props.date), [dateTasks])

    useEffect(() => {
        if (!tasks.length || !user) return
        setDateTasks(getDateTasks(tasks, events, user, props.date))
    }, [tasks, user, props.date])

    useEffect(() => {
        if (!events.length || !user) return
        setDateEvents(getDateEvents(events, props.date))
    }, [events, user, props.date])

    useEffect(() => {
        if (!events.length || !user) return
        setDateReminders(getDateReminders(reminders, props.date))
    }, [events, user, props.date])

    const getDeadlineStatus = (deadline: Date) => {
        const today = new Date()
        if (deadline.getTime() < today.getTime()) return "past_due"
        return "on_time"
    }

    const handleCompleteClick = () => {
        setConfirmMessage(`Mark "${current?.step.name}" as Complete?`)
        setConfirmOpen(true)
    }

    const handleCompleteConfirm = () => {
        setConfirmOpen(false)
        if (!current) return
        const url = `/api/v1/items/${current.item.id}/steps/${current.step.id}/complete`
        API.post<{ completed: string }>(url, {}, true).then(data => {
            const newAgendaItems = [ ...agendaItems ]
            const foundItem = newAgendaItems.find(item => item.id === current.item.id)
            const foundStep = foundItem && foundItem.type === "task" ? foundItem.steps.find(step => step.id === current.step.id) : undefined
            if (foundStep) foundStep.completed = data.completed
            setAgendaItems(newAgendaItems)
        }).catch(err => {
            setAlertMessage(err.message)
            setAlertOpen(true)
        })
    }

    const renderCurrentStep = (task: Task, step: Step) => {
        return (
            <Card layer={3} fieldset label={step.name}>
                Current Step
            </Card>
        )
    }

    return(
        <div className={styles.frame}>
            <div>
                <FieldFrame>
                    <DateCard />
                    <Timeline events={dateEvents} />
                </FieldFrame>
            </div>
            <div>
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
            </div>
        </div>
    )
}