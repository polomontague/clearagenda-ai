import Event from "@/types/Event"
import User from "@/types/User"
import Events from "."

export default function getStatus(event: Event, user: User): {
        code: "upcoming" | "repeating" | "ended",
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
    if (event.occurs === "once") {
        const ended = Events.getEnded(event)
        if (ended) return { code: "ended", color: COLORS.gray, label: "Ended" }
        return { code: "upcoming", color: COLORS.sky, label: "Upcoming" }
    } else { // Repeating event
        return { code: "repeating", color: COLORS.lavender, label: "Repeating" }
    }
}