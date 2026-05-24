import Event from "@/types/Event"
import { DateTime } from "luxon"

export default function getEnded(event: Event): boolean {
    const now = new Date()
    if (event.occurs === "once") {
        const ends = new Date(event.starts)
        ends.setMinutes(ends.getMinutes() + event.duration)
        return ends.getTime() >= now.getTime()
    } else { // Repeating
        if (!event.repeat.ends) return false
        const [year, month, day] = event.repeat.ends.split("-").map(Number)
        const ends = DateTime.fromObject({
            year,
            month, 
            day
        }, { zone: event.timezone }).endOf("day").toJSDate()
        return ends.getTime() >= now.getTime()
    }
}