import Utility from "../Utility"
import Event from "@/types/Event"
import { DateTime } from "luxon"

export default function getFrom(event: Event): string {
    if (event.occurs === "once") {
        const starts = new Date(event.starts)
        const ends = new Date(starts)
        ends.setMinutes(ends.getMinutes() + event.duration)
        const sameDay = Utility.getDateKey(starts) === Utility.getDateKey(ends)
        if (sameDay) {
            return `${Utility.formatTime(starts)} - ${Utility.formatTime(ends)}`
        } else {
            return `${Utility.formatDate(starts)} - ${Utility.formatDate(ends)}`
        }
    } else { // Repeating
        const [hours, minutes, seconds, milliseconds] = event.starts.split(/[:.]/).map(Number)
        const zonedStarts = DateTime.now().setZone(event.timezone).set({
            hour: hours,
            minute: minutes,
            second: seconds,
            millisecond: milliseconds
        })
        const zonedEnds = zonedStarts.plus({ minutes: event.duration })
        const starts = zonedStarts.toJSDate()
        const ends = zonedEnds.toJSDate()
        const sameDay = Utility.getDateKey(starts) === Utility.getDateKey(ends)
        if (sameDay) {
            return `${Utility.formatTime(starts)} - ${Utility.formatTime(ends)}`
        } else {
            return `${Utility.formatTime(starts)} for ${Utility.formatDuration(event.duration)}`
        }
    }
}