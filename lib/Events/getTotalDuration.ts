import { EventOccurrence } from "@/types/Event"

export const getTotalDuration = (events: EventOccurrence[]): number => {
    let total = 0
    for (const event of events) {
        const duration = Math.round(((event.ends.getTime() - event.starts.getTime()) / 1000) / 60)
        total += duration
    }
    return total
}