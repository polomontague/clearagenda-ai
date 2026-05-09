import Reminder from "@/types/Reminder"
import { createContext } from "react"

const RemindersContext = createContext<{
    reminders: Reminder[],
    addReminder: (reminder: Reminder) => void,
    updateReminder: (reminder: Reminder) => void,
    removeReminder: (reminder: Reminder) => void
}>({
    reminders: [],
    addReminder: () => {},
    updateReminder: () => {},
    removeReminder: () => {}
})

export default RemindersContext