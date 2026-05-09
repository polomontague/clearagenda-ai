import Event, { RepeatingEvent } from "@/types/Event"

export default function getDateEvents(events: Event[], date: Date): Event[] {
    const result: Event[] = []
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)
    for (const event of events) {
        if (event.occurs === "once") {
            const starts = new Date(event.starts)
            const ends = new Date(starts.getTime() + (event.duration * 60 * 1000)) // convert seconds to milliseconds
            if (starts < dayEnd && ends > dayStart) {
                result.push(event)
            }
            continue
        }
        if (event.occurs === "repeating") {

        }
    }
    console.log('day events', result)
    return result
}

const occursOnDate = (event: RepeatingEvent, date: Date): boolean => {

}