import Reminder from "@/types/Reminder"
import Utility from "./Utility"
import User from "@/types/User"

const Reminders = {
    getAt: (reminder: Reminder): {
        date?: string,
        time: string
    } => {
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
    },
    getStatus: (reminder: Reminder, user: User): {
        code: "upcoming" | "past" | "repeating",
        color: string,
        label: string
    } => {
        const accent = user.preferences.accent
        const COLORS = {
            sky: accent === "sky" ? "var(--turquoise)" : "var(--sky)",
            red: accent === "red" ? "var(--coral)" : "var(--red)",
            yellow: accent === "yellow" ? "var(--orange)" : "var(--yellow)",
            lavender: accent === "lavender" ? "var(--pink)" : "var(--lavender)",
            gray: "var(--layer-4-light)"
        }
        const now = new Date()
        if (reminder.occurs === "once") {
            const [year, month, day, hours, minutes] = reminder.at.split(/[- :.]/).map(Number)
            const at = new Date()
            at.setFullYear(year)
            at.setMonth(month)
            at.setDate(day)
            at.setHours(hours)
            at.setMinutes(minutes)
            if (at > now) return { code: "past", color: COLORS.gray, label: "Past" }
            return { code: "upcoming", color: COLORS.sky, label: "Upcoming"}
        } else { // Repeating
            return { code: "repeating", color: COLORS.lavender, label: "Repeating" }
        }
    }
}

export default Reminders