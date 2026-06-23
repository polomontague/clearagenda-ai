import Events from "../Events"
import Event from "@/types/Event"

export const getDateEventOccupancy = (events: Event[], date: Date): number => {
    const dateEvents = Events.getDateEvents(events, date)
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setDate(dayEnd.getDate() + 1)
    dayEnd.setHours(0, 0, 0, 0)
    let total = 0
    for (const occurrence of dateEvents) {
        const starts = occurrence.starts
        const ends = occurrence.ends
        const overlapStart = new Date(Math.max(starts.getTime(), dayStart.getTime()))
        const overlapEnd = new Date(Math.min(ends.getTime(), dayEnd.getTime()))
        const overlapMilliseconds = overlapEnd.getTime() - overlapStart.getTime()
        if (overlapMilliseconds > 0) {
            total += overlapMilliseconds / (1000 * 60)
        }
    }
    return total
}