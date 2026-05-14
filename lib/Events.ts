import Event from "@/types/Event"
import Utility from "./Utility"
import { DateTime } from "luxon"

const Events = {
    getTimeRange: (event: Event): string => {
        if (event.occurs === "once") {
            const starts = new Date(event.starts)
            const ends = new Date(starts)
            ends.setMinutes(ends.getMinutes() + event.duration)
            return `${Utility.formatTime(starts)} - ${Utility.formatTime(ends)}`
        } else { // Repeating
            const starts = DateTime.
        }
    }
}

export default Events