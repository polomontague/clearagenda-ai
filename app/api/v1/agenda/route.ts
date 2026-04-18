import { NextRequest } from "next/server"
import Response from "@/lib/Response"
import HttpError from "@/lib/HttpError"
import Error from "@/lib/Error"
import ItemsDAO from "@/dao/ItemsDAO"
import Auth from "@/lib/Auth"
import Request from "@/lib/Request"
import { agendaQuerySchema } from "@/schemas/agenda"
import User from "@/types/User"
import Agenda, { AgendaItem } from "@/types/Agenda"
import Item from "@/types/Item"

export const GET = async (req: NextRequest) => {
    try {
        const user = await Auth.authenticate(req)
        const query = Request.query(req, agendaQuerySchema)
        const start = new Date(query.start)
        const weekdays: (keyof User["preferences"]["hours"])[] = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ]
        const dayHours = user.preferences.hours[weekdays[start.getDay()]]
        const dayMinutes = dayHours * 60
        
        const items = await ItemsDAO.getItems({ user_id: user.id })
        const flattened = flattenSteps(items)
        const completed = flattened.filter(item => item.step.completed)
        // Sort completed by completion time
        completed.sort((a, b) => {
            return new Date(a.step.completed!).getTime() - new Date(b.step.completed!).getTime()
        })
        const incomplete = flattened.filter(item => !item.step.completed)
        // Sort incomplete by priority
        incomplete.sort((a, b) => {
            const priorityA = a.urgency + (a.importance * (1 - a.urgency))
            const priorityB = b.urgency + (b.importance * (1 - b.urgency))
            if (priorityA !== priorityB) return priorityB - priorityA // higher priority first
            // tie-breaker: older tasks first
            return new Date(a.created).getTime() - new Date(b.created).getTime()
        })
        console.log(completed)
        const days = groupIntoDays(flattened, dayMinutes)

        return Response.ok({ agenda: days[0] })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
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

const groupIntoDays = (items: AgendaItem[], minutesPerDay: number): Agenda[] => {
    const days: Agenda[] = []
    let currentDay: Agenda = { items: [] }
    let currentDayMinutes = 0
    for (const item of items) {
        if (currentDayMinutes + item.step.duration > minutesPerDay) {
            // Start new day
            days.push(currentDay)
            currentDay = { items: [] }
            currentDayMinutes = 0
        }
        currentDay.items.push(item)
        currentDayMinutes += item.step.duration
    }
    // Add last day if not empty
    if (currentDay.items.length > 0) {
        days.push(currentDay)
    }
    return days
}