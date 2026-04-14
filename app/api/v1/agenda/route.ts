import { NextRequest } from "next/server"
import Response from "@/lib/Response"
import HttpError from "@/lib/HttpError"
import Error from "@/lib/Error"
import ItemsDAO from "@/dao/ItemsDAO"
import Auth from "@/lib/Auth"
import Request from "@/lib/Request"
import { agendaQuerySchema } from "@/schemas/agenda"
import User from "@/types/User"
import Agenda from "@/types/Agenda"
import Item from "@/types/Item"

export const GET = async (req: NextRequest) => {
    try {
        const user = await Auth.authenticate(req)
        const query = Request.query(req, agendaQuerySchema)
        const date = query.date ? new Date(query.date) : new Date()
        const today = new Date()
        const differenceDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)) // 1 day in milliseconds
        // differenceDays is negative → closer to 0 = closer to today
        const dayIndex = differenceDays <= 0 ? Math.abs(differenceDays) : 0
        const weekdays: (keyof User["preferences"]["hours"])[] = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ]
        const dayHours = user.preferences.hours[weekdays[date.getDay()]]
        const dayMinutes = dayHours * 60
        
        const items = await ItemsDAO.getItems({ user_id: user.id })
        items.sort((a, b) => {
            const priorityA = a.urgency + (a.importance * (1 - a.urgency))
            const priorityB = b.urgency + (b.importance * (1 - b.urgency))
            if (priorityA !== priorityB) return priorityB - priorityA // higher priority first
            // tie-breaker: older tasks first
            return new Date(a.created).getTime() - new Date(b.created).getTime()
        })
        const agendas = groupItemsIntoAgendas(items, dayMinutes)
        const agenda = agendas[dayIndex] ?? { tasks: [] }

        return Response.ok({ agenda })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}

const groupItemsIntoAgendas = (items: Item[], maxMinutesPerDay: number = 480): Agenda[] => {
    const days: Agenda[] = []
    let currentDay: Agenda = { items: [] }
    let currentDayMinutes = 0

    for (const item of items) {
        for (const step of item.steps) {
            if (currentDayMinutes + step.duration > maxMinutesPerDay) {
                // Start new day
                days.push(currentDay)
                currentDay = { items: [] }
                currentDayMinutes = 0
            }
            currentDay.items.push({
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
            currentDayMinutes += step.duration
        }
    }

    // Add last day if not empty
    if (currentDay.items.length > 0) {
        days.push(currentDay)
    }

    return days
}