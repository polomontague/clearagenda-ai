"use client"
import styles from "./AgendaPage.module.css"
import { useContext, useEffect, useState, useMemo } from "react"
import PageFrame from "@/components/PageFrame"
import SelectBar from "@/components/SelectBar"
import DatePicker from "@/components/DatePicker"
import Modal from "@/components/Modal"
import SquareButton from "@/components/SquareButton"
import { CalendarIcon } from "@/components/Icons"
import DateEvents from "@/components/DateEvents"
import DateReminders from "@/components/DateReminders"
import DateTasks from "@/components/DateTasks"
import AgendaOverview from "@/components/AgendaOverview"
import TasksContext from "@/contexts/TasksContext"
import EventsContext from "@/contexts/EventsContext"
import UserContext from "@/contexts/UserContext"
import Tasks from "@/lib/Tasks"
import Events from "@/lib/Events"
import RemindersContext from "@/contexts/RemindersContext"
import Reminders from "@/lib/Reminders"

export default function AgendaPage() {
    const { tasks } = useContext(TasksContext)
    const { events } = useContext(EventsContext)
    const { reminders } = useContext(RemindersContext)
    const { user } = useContext(UserContext)
    const [modalOpen, setModalOpen] = useState(false)
    const [day, setDay] = useState(new Date())
    const [type, setType] = useState<"tasks" | "events" | "reminders">("tasks")
    const dateTasks = useMemo(() => {
        if (!user) return []
        return Tasks.getDateTasks(tasks, events, user, day)
    }, [tasks, events, user, day])
    const dateEvents = useMemo(() => Events.getDateEvents(events, day), [events, day])
    const dateReminders = useMemo(() => Reminders.getDateReminders(reminders, day), [reminders, day])

    useEffect(() => {
        const scheduleMidnight = () => {
            const now = new Date()
            const nextMidnight = new Date()
            nextMidnight.setHours(24, 0, 0, 0)
            const millisecondsTillMidnight = nextMidnight.getTime() - now.getTime()
            const timeout = setTimeout(() => {
                setDay(new Date())
                // Reschedule for next day
                scheduleMidnight()
            }, millisecondsTillMidnight)
            return timeout
        }
        const timeout = scheduleMidnight()
        return () => clearTimeout(timeout)
    }, [])

    const handleDayChange = (val: Date) => {
        setDay(val)
        setModalOpen(false)
    }

    return (
        <PageFrame
            header={{
                center: (
                    <SelectBar
                        options={[
                            { value: "tasks", label: "Tasks" },
                            { value: "events", label: "Events" },
                            { value: "reminders", label: "Reminders" }
                        ] as const}
                        value={type}
                        onChange={setType}
                    />
                ),
                right: (
                    <SquareButton
                        icon={<CalendarIcon />}
                        onClick={() => setModalOpen(true)}
                    />
                )
            }}
        >
            <div className={styles.frame}>
                <header className={styles.header}>
                    <AgendaOverview
                        tasks={dateTasks}
                        events={dateEvents}
                        reminders={dateReminders}
                        day={day}
                    />
                </header>
                {type === "tasks" ? (
                    <DateTasks
                        tasks={dateTasks}
                        day={day}
                        onDayChange={setDay}
                    />
                ) : type === "events" ? (
                    <DateEvents events={dateEvents} day={day} />
                ) : type === "reminders" ? (
                    <DateReminders reminders={dateReminders} day={day} />
                ) : <></>}
            </div>
            <Modal
                label="Choose Date"
                open={modalOpen}
                onRequestClose={() => setModalOpen(false)}
            >
                <DatePicker value={day} onChange={handleDayChange} />
            </Modal>
        </PageFrame>
    )
}