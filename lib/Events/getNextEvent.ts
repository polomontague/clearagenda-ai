import { EventOccurrence } from "@/types/Event"

export const getNextEvent = (events: EventOccurrence[]): EventOccurrence | undefined => {
    const now = new Date()
    let nextEvent: EventOccurrence | undefined
    let nextTime = Infinity
    for (const event of events) {
        const time = event.starts.getTime()
        if (time < now.getTime()) continue
        if (time < nextTime) {
            nextTime = time
            nextEvent = event
        }
    }
    return nextEvent
}