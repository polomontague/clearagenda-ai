"use client"
import { useContext, useMemo } from "react"
import RemindersContext from "@/contexts/RemindersContext"
import Reminders from "@/lib/Reminders"
import Timeline, { Point } from "../Timeline"
import Reminder from "@/types/Reminder"
import Utility from "@/lib/Utility"

export default function DateReminders({ date }: {
    date: Date
}) {
    const { reminders } = useContext(RemindersContext)
    const dateReminders = useMemo(() => Reminders.getDateReminders(reminders, date), [reminders, date])

    const at = new Date()
    at.setHours(10, 0, 0, 0)

    const reminderToPoint = (reminder: Reminder): Point => {
        if (reminder.occurs === "once") {
            return {
                at: Utility.loadLocalDateTime(reminder.at),
                label: reminder.name
            }
        } else { // Repeating
            return {
                at: Utility.loadLocalTime(reminder.at),
                label: reminder.name
            }
        }
    }

    return (
        <Timeline
            date={date}
            blocks={[]}
            points={dateReminders.map(reminder => reminderToPoint(reminder))}
        />
    )
}