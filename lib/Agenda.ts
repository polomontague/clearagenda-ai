import Item from "@/types/Item"
import AgendaType, { AgendaItem } from "@/types/Agenda"
import User from "@/types/User"

const Agenda = {
    createAgenda: (items: Item[], date: Date, hours: User["preferences"]["hours"]): AgendaType => {
        const flattened = flattenSteps(items).sort((a, b) => b.priority - a.priority)
        const days = groupIntoDays(flattened, hours)
        const key = date.toLocaleDateString("en-CA")
        const agenda = days[key] ? { items: days[key] } : { items: [] }
        return agenda
    },
    getDeadlineStatus: (deadline: Date) => {
        const today = new Date()
        if (deadline.getTime() < today.getTime()) return "past_due"
        return "on_time"
    },
    getTotalMinutes: (items: AgendaItem[]) => {
        let total = 0
        for (const item of items) {
            total += item.step.duration
        }
        return total
    }
}

const flattenSteps = (items: Item[]): AgendaItem[] => {
    const flattened: AgendaItem[] = []
    for (const item of items) {
        for (const step of item.steps) {
            flattened.push({
                id: item.id,
                user: item.user,
                name: item.name,
                description: item.description,
                step,
                deadline: item.deadline,
                urgency: item.urgency,
                importance: item.importance,
                priority: item.priority,
                created: item.created,
                updated: item.updated
            })
        }
    }
    return flattened
}

const groupIntoDays = (items: AgendaItem[], hours: User["preferences"]["hours"]) => {
    // simulate agendas for each day accounting for differing hours preferences for each weekday
    const completed = items.filter(item => item.step.completed)
    const incomplete = items.filter(item => !item.step.completed)
    const days = groupCompletedIntoDays(completed)
    const currentDate = new Date()
    const weekdays: (keyof User["preferences"]["hours"])[] = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ]
    for (const item of incomplete) {
        const key = currentDate.toLocaleDateString("en-CA")
        if (!days[key]) days[key] = []
        // Add item to currentDay
        days[key].push(item)
        let currentWeekdayMinutes = hours[weekdays[currentDate.getDay()]] * 60
        if (Agenda.getTotalMinutes(days[key]) + item.step.duration > currentWeekdayMinutes) {
            // Start new day
            currentDate.setDate(currentDate.getDate() + 1)
        }
    }
    return days
}

const groupCompletedIntoDays = (items: AgendaItem[]) => {
    const days: Record<string, AgendaItem[]> = {}
    for (const item of items) {
        if (item.step.completed) {
            const key = new Date(item.step.completed).toLocaleDateString("en-CA")
            if (!days[key]) days[key] = []
            days[key].push(item)
        }
    }
    return days
}

export default Agenda