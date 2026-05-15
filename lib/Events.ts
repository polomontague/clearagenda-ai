import Event, { OnceEvent } from "@/types/Event"
import Utility from "./Utility"
import { DateTime } from "luxon"

const Events = {
    getFrom: (event: Event): string => {
        if (event.occurs === "once") {
            const starts = new Date(event.starts)
            const ends = new Date(starts)
            ends.setMinutes(ends.getMinutes() + event.duration)
            return `${Utility.formatTime(starts)} - ${Utility.formatTime(ends)}`
        } else { // Repeating
            
        }
    },
    getEnded: (event: OnceEvent): boolean => {
        const ends = new Date(event.starts)
        ends.setMinutes(ends.getMinutes() + event.duration)
        return ends.getTime() >= new Date().getTime()
    },
    getStatus: (event: Event, user: User): {
        code: "upcoming" | "repeating" | "ended",
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
        if (event.occurs === "once") {
            const ended = Events.getEnded(event)
            if (ended) return { code: "ended", color: COLORS.gray, label: "Ended" }
            return { code: "upcoming", color: COLORS.sky, label: "Upcoming" }
        } else { // Repeating event
            return { code: "repeating", color: COLORS.lavender, label: "Repeating" }
        }
    }
}

export default Events