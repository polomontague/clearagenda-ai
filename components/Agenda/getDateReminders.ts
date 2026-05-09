import Reminder from "@/types/Reminder"
import getDateKey from "./getDateKey"
import occursOnFloatingDate from "./occursOnFloatingDate"

const getDateReminders = (reminders: Reminder[], date: Date) => {
    const result: Reminder[] = []
    for (const reminder of reminders) {
        if (reminder.occurs === "once") {
            const atKey = reminder.at.slice(0, 10)
            const dateKey = getDateKey(date)
            if (atKey === dateKey) {
                result.push(reminder)
            }
            continue
        }
        if (reminder.occurs == "repeating") {
            if (occursOnFloatingDate(reminder, date)) {
                result.push(reminder)
            }
        }
    }

    console.log('reminders result', result)
}

export default getDateReminders