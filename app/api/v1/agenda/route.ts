import { NextRequest } from "next/server"
import Response from "@/lib/Response"
import HttpError from "@/lib/HttpError"
import Error from "@/lib/Error"
import TasksDAO from "@/dao/TasksDAO"
import Task from "@/types/Task"
import Auth from "@/lib/Auth"
import Request from "@/lib/Request"
import { agendaQuerySchema } from "@/schemas/agenda"
import User from "@/types/User"
import Agenda from "@/types/Agenda"

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
        
        const tasks = await TasksDAO.getTasks({ user_id: user.id })
        tasks.sort((a, b) => {
            const priorityA = a.urgency + (a.importance * (1 - a.urgency))
            const priorityB = b.urgency + (b.importance * (1 - b.urgency))
            if (priorityA !== priorityB) return priorityB - priorityA // higher priority first
            // tie-breaker: older tasks first
            return new Date(a.created).getTime() - new Date(b.created).getTime()
        })
        const agendas = groupTasksIntoAgendas(tasks, dayMinutes)
        const agenda = agendas[dayIndex] ?? { tasks: [] }

        return Response.ok({ agenda })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}

const groupTasksIntoAgendas = (tasks: Task[], maxMinutesPerDay: number = 480): Agenda[] => {
    const days: Agenda[] = []
    let currentDay: Agenda = { items: [] }
    let currentDayMinutes = 0

    for (const task of tasks) {
        if (task.type === "simple") {
            if (currentDayMinutes + task.duration > maxMinutesPerDay) {
                // Start a new day
                days.push(currentDay)
                currentDay = { items: [] }
                currentDayMinutes = 0
            }
            currentDay.items.push({
                type: "task",
                task
            })
            currentDayMinutes += task.duration
        } else if (task.type === "complex") {
            for (const step of task.steps) {
                if (currentDayMinutes + step.duration > maxMinutesPerDay) {
                    // Start new day
                    days.push(currentDay)
                    currentDay = { items: [] }
                    currentDayMinutes = 0
                }
                currentDay.items.push({
                    type: "task",
                    task: {
                        type: task.type,
                        id: task.id,
                        user: task.user,
                        name: task.name,
                        description: task.description,
                        step,
                        deadline: task.deadline,
                        urgency: task.urgency,
                        importance: task.importance,
                        priority: task.priority,
                        created: task.created,
                        updated: task.updated
                    }
                })
                currentDayMinutes += step.duration
            }
        }
    }

    // Add last day if not empty
    if (currentDay.items.length > 0) {
        days.push(currentDay)
    }

    return days
}