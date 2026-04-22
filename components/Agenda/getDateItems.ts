import Item, { Task, Event } from "@/types/Item"
import User from "@/types/User"
import getCompletion from "./getCompletion"
import getDayMinutes from "./getDayMinutes"
import occursOnDate from "./occursOnDate"

type CompletionTask = Task & {
    completion: number
}

export type CompletionItem = CompletionTask | Event

export type Day = Record<number, CompletionItem>

type Days = Record<string, Day>

export default function getDateItems(items: Item[], date: Date, hours: User["preferences"]["hours"]): CompletionItem[] {
    items.sort((a, b) => b.priority - a.priority)
    const days: Days = {}
    const currentDate = new Date()
    const weekdays: (keyof User["preferences"]["hours"])[] = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ]
    for (const item of items) {
        if (item.type === "task") {
            const completion = getCompletion(item)
            for (const step of item.steps) {
                if (step.completed) {
                    const key = new Date(step.completed).toLocaleDateString("en-CA")
                    if (!days[key]) days[key] = {} // Add date to days if it doesn't already exist
                    if (!days[key][item.id]) days[key][item.id] = { // Add item to date if it doesn't already exist
                        ...item,
                        steps: [],
                        completion
                    }
                    const item2 = days[key][item.id]
                    if (item2.type === "task") item2.steps.push(step)
                } else {
                    let key = currentDate.toLocaleDateString("en-CA")
                    if (!days[key]) days[key] = {} // Add date to days if it doesn't already exist
                    const minutes = getDayMinutes(days[key])
                    const minutesLimit = hours[weekdays[currentDate.getDay()]] * 60
                    if (minutes + step.duration >= minutesLimit) { // Start new day if current day is full
                        currentDate.setDate(currentDate.getDate() + 1)
                    }
                    key = currentDate.toLocaleDateString("en-CA")
                    if (!days[key]) days[key] = {} // Add date to days if it doesn't already exist
                    if (!days[key][item.id]) days[key][item.id] = { // Add item to date if it doesn't already exist
                        ...item,
                        steps: [],
                        completion
                    }
                    const item2 = days[key][item.id]
                    if (item2.type === "task") item2.steps.push(step)
                }
            }
        } else if (item.type === "event") {
            if (occursOnDate(item, date)) {
                const key = date.toLocaleDateString("en-CA")
                if (!days[key]) days[key] = {} // Add date to days if it doesn't already exist
                days[key][item.id] = item
            }
        }
    }
    const key = date.toLocaleDateString("en-CA")
    const day = days[key] ? days[key] : []
    return Object.entries(day).map(([_, item]) => item)
}