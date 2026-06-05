"use client"
import Timeline, { Point } from "../Timeline"
import Reminder from "@/types/Reminder"
import Utility from "@/lib/Utility"

export default function DateReminders({ reminders, day }: {
    reminders: Reminder[],
    day: Date
}) {
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
                at: Utility.loadLocalTime(reminder.at, day),
                label: reminder.name
            }
        }
    }

    return (
        <Timeline
            date={day}
            blocks={[]}
            points={reminders.map(reminder => reminderToPoint(reminder))}
        />
    )
}