import Reminder from "@/types/Reminder"
import Utility from "../Utility"

export default function getAt(reminder: Reminder): {
    date?: string,
    time: string
} {
    if (reminder.occurs === "once") {
        const at = Utility.loadLocalDateTime(reminder.at)
        return {
            date: Utility.formatDate(at),
            time: Utility.formatTime(at)
        }
    } else {
        const at = Utility.loadLocalTime(reminder.at)
        return { // Repeating
            time: Utility.formatTime(at)
        }
    }
}