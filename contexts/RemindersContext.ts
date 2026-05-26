import Reminder from "@/types/Reminder"
import { createContext } from "react"

const RemindersContext = createContext<{
    reminders: Reminder[],
    addReminder: (reminder: Reminder) => void,
    replaceReminder: (reminder: Reminder) => void,
    removeReminder: (reminder: Reminder) => void,
    loading: boolean
}>({
    reminders: [],
    addReminder: () => {},
    replaceReminder: () => {},
    removeReminder: () => {},
    loading: true
})

export default RemindersContext