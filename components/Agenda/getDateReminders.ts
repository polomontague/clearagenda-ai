import Reminder from "@/types/Reminder"
import Utility from "@/lib/Utility"
import occursOnLocalDate from "./occursOnLocalDate"

export default function getDateReminders(reminders: Reminder[], date: Date): Reminder[] {
    const result: Reminder[] = []
    for (const reminder of reminders) {
        if (reminder.occurs === "once") {
            const atKey = reminder.at.slice(0, 10)
            const dateKey = Utility.getDateKey(date)
            if (atKey === dateKey) {
                result.push(reminder)
            }
            continue
        }
        if (reminder.occurs == "repeating") {
            if (occursOnLocalDate(reminder.repeat, date)) {
                result.push(reminder)
            }
        }
    }
    return result
}