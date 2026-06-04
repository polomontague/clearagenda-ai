import Reminder from "@/types/Reminder"
import Utility from "../Utility"

export const getNextReminder = (reminders: Reminder[]): Reminder | undefined => {
    const now = new Date()
    let nextReminder: Reminder | undefined
    let nextTime = Infinity
    for (const reminder of reminders) {
        const at = reminder.occurs === "once" ? (
            Utility.loadLocalDateTime(reminder.at)
        ) : ( // Repeating
            Utility.loadLocalTime(reminder.at)
        )
        const time = at.getTime()
        if (time < now.getTime()) continue
        if (time < nextTime) {
            nextTime = time
            nextReminder = reminder
        }
    }
    return nextReminder
}