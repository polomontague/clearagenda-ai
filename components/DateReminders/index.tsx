"use client"
import { useContext, useMemo } from "react"
import RemindersContext from "@/contexts/RemindersContext"
import Reminders from "@/lib/Reminders"
import Timeline from "../Timeline"

export default function DateReminders({ date }: {
    date: Date
}) {
    const { reminders } = useContext(RemindersContext)
    const dateReminders = useMemo(() => Reminders.getDateReminders(reminders, date), [reminders, date])

    return (
        <Timeline events={[]} />
    )
}