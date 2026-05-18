import Utility from "../Utility"
import Event from "@/types/Event"

export default function getFrom(event: Event): string {
    if (event.occurs === "once") {
        const starts = new Date(event.starts)
        const ends = new Date(starts)
        ends.setMinutes(ends.getMinutes() + event.duration)
        return `${Utility.formatTime(starts)} - ${Utility.formatTime(ends)}`
    } else { // Repeating
        
    }
}