import Item from "@/types/Item"
import occursOnDate from "./occursOnDate"

export default function getDateItems(items: Item[], date: Date) {
    const dates: Record<string, Item[]> = {}
    const oneTimeEvents = items.filter(item => item.type === "event" && item.occurs === "once")
    const repeatingEvents = items.filter(item => item.type === "event" && item.occurs === "repeating")
    const repeatingTasks = items.filter(item => item.type === "task" && item.occurs === "repeating")
    for (const event of oneTimeEvents) {
        // One-Time Events are added first
        // Fixed block of time, Added to the date of Starts (ISO 8601) in local time
        const key = new Date(event.starts).toLocaleDateString("en-CA")
        if (!dates[key]) dates[key] = [] // Add date if missing
        dates[key].push(event)
    }
    for (const event of repeatingEvents) {
        // Repeating Events are added second
        // Fixed block of time
        // Repeats based off of event.timezone between repeat.starts & repeat.ends (optional)
        if (occursOnDate(event, new Date())) {
            const key = date.toLocaleDateString("en-CA")
            if (!dates[key]) dates[key] = [] // Add date is missing
            dates[key].push(event)
        }
    }
    console.log(dates)
    return []
}