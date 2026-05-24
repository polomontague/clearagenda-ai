import Reminder from "@/types/Reminder"
import User from "@/types/User"
import Utility from "../Utility"

export default function getStatus(reminder: Reminder, user: User): {
    code: "upcoming" | "past" | "repeating" | "repeating_ended",
    color: string,
    label: string
} {
    const accent = user.preferences.accent
    const COLORS = {
        sky: accent === "sky" ? "var(--turquoise)" : "var(--sky)",
        red: accent === "red" ? "var(--coral)" : "var(--red)",
        yellow: accent === "yellow" ? "var(--orange)" : "var(--yellow)",
        lavender: accent === "lavender" ? "var(--pink)" : "var(--lavender)",
        gray: "var(--layer-4-light)"
    }
    if (reminder.occurs === "once") {
        const now = new Date()
        const at = Utility.loadLocalDateTime(reminder.at)
        const past = at < now
        if (past) return { code: "past", color: COLORS.gray, label: "Past" }
        return { code: "upcoming", color: COLORS.sky, label: "Upcoming"}
    } else { // Repeating
        const ended = Utility.getLocalRepeatingEnded(reminder.repeat)
        if (ended) return { code: "repeating_ended", color: COLORS.gray, label: "Repeating Ended" }
        return { code: "repeating", color: COLORS.lavender, label: "Repeating" }
    }
}