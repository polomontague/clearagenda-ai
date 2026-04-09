import { NextRequest } from "next/server"
import Response from "@/lib/Response"
import HttpError from "@/lib/HttpError"
import Error from "@/lib/Error"
import TasksDAO from "@/dao/TasksDAO"
import Task, { SimpleTask, ComplexTaskStep } from "@/types/Task"

type Day = {
    tasks: (SimpleTask | ComplexTaskStep)[]
}

export const GET = async (req: NextRequest) => {
    try {
        const tasks = await TasksDAO.getTasks()
        tasks.sort((a, b) => {
            const priorityA = a.urgency + (a.importance * (1 - a.urgency))
            const priorityB = b.urgency + (b.importance * (1 - b.urgency))
            if (priorityA !== priorityB) return priorityB - priorityA; // higher priority first
            // tie-breaker: older tasks first
            return new Date(a.created).getTime() - new Date(b.created).getTime()
        })
        const days = groupTasksIntoDays(tasks)
        console.log(days)

        return Response.ok({ tasks })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}

const groupTasksIntoDays = (tasks: Task[], maxMinutesPerDay: number = 480): Day[] => {
    const days: Day[] = []
    let currentDay: Day = { tasks: [] }
    let currentDayMinutes = 0

    for (const task of tasks) {
        if (task.type === "simple") {
            if (currentDayMinutes + task.duration > maxMinutesPerDay) {
                // Start a new day
                days.push(currentDay)
                currentDay = { tasks: [] }
                currentDayMinutes = 0
            }
            currentDay.tasks.push(task)
            currentDayMinutes += task.duration
        } else if (task.type === "complex") {
            for (const step of task.steps) {
                if (currentDayMinutes + step.duration > maxMinutesPerDay) {
                    // Start new day
                    days.push(currentDay)
                    currentDay = { tasks: [] }
                    currentDayMinutes = 0
                }
                currentDay.tasks.push(step)
                currentDayMinutes += step.duration
            }
        }
    }

    // Add last day if not empty
    if (currentDay.tasks.length > 0) {
        days.push(currentDay)
    }

    return days
}