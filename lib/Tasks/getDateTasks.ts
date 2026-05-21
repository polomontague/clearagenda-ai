import Task from "@/types/Task"
import Event from "@/types/Event"
import User from "@/types/User"
import Utility from "@/lib/Utility"
import getWeekdayCapacity from "./getWeekdayCapacity"
import Events from "../Events"
import occursOnLocalDate from "./occursOnLocalDate"

type StepInstance = {
    occurs: "once" | "repeating",
    taskId: number,
    stepId: number,
    duration: number,
    date: string
}

export default function getDateTasks(tasks: Task[], events: Event[], user: User, date: Date): Task[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = new Date(date)
    target.setHours(0, 0, 0, 0)
    const stepInstances = getIncompleteStepInstancesUntilDate(tasks, date)
    const queue = [ ...stepInstances ] // Remaining unscheduled steps queue
    const scheduledStepsByDate: Record<string, StepInstance[]> = {}
    // Step through days from today to target date
    const current = new Date(today)
    while (current.getTime() <= target.getTime()) {
        const dateKey = Utility.getDateKey(current)
        const capacity = getWeekdayCapacity(user, current)
        const eventOccupancy = getDateEventOccupancy(events, current)
        const completedTaskOccupancy = getDateCompletedTaskOccupancy(tasks, current)
        const scheduledOccupancy = (scheduledStepsByDate[dateKey] ?? []).reduce((total, stepInstance) => total + stepInstance.duration, 0)
        const used = eventOccupancy + completedTaskOccupancy + scheduledOccupancy
        let remaining = capacity - used
        if (!scheduledStepsByDate[dateKey]) scheduledStepsByDate[dateKey] = [] // Add date if it doesn't already exist
        for (const stepInstance of queue) {
            const alreadyScheduled = Object.values(scheduledStepsByDate).flat().some(
                s => s.taskId === stepInstance.taskId &&
                    s.stepId === stepInstance.stepId &&
                    s.date === stepInstance.date
            )
            if (alreadyScheduled) continue
            if (stepInstance.date > dateKey) continue // Repeating task step hasn't occured yet
            if (stepInstance.duration > remaining) continue // Step doesn't fit in current day
            scheduledStepsByDate[dateKey].push(stepInstance) // Schedule the step
            remaining -= stepInstance.duration
        }
        current.setDate(current.getDate() + 1)
    }
    const scheduledStepInstances = scheduledStepsByDate[Utility.getDateKey(target)] ?? []
    // Group scheduled steps back into tasks
    const taskMap = new Map<number, Task>()
    for (const stepInstance of scheduledStepInstances) {
        const task = tasks.find(task => task.id === stepInstance.taskId)
        if (!task) continue
        const step = task.steps.find(step => step.id === stepInstance.stepId)
        if (!step) continue
        // Add task to map if it doesn't already exist
        if (!taskMap.has(task.id)) taskMap.set(task.id, {
            ...task,
            steps: []
        })
        const scheduledTask = taskMap.get(task.id)!
        scheduledTask.steps.push(step as never)
    }
    // Get steps completed on requested date
    const completedTasks = getDateCompletedTasks(tasks, date)
    const scheduledTasks = Array.from(taskMap.values())
    return [ ...completedTasks, ...scheduledTasks ]
}

const getIncompleteStepInstancesUntilDate = (tasks: Task[], date: Date) => {
    const result: StepInstance[] = []
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(0, 0, 0, 0)
    const startKey = Utility.getDateKey(start)
    for (const task of tasks) {
        // Once tasks
        if (task.occurs === "once") {
            for (const step of task.steps) {
                if (step.completed) continue
                result.push({
                    occurs: "once",
                    taskId: task.id,
                    stepId: step.id,
                    duration: step.duration,
                    date: startKey
                })
            }
            continue
        }
        // Repeating tasks - Iterate through days
        const current = new Date(start)
        while (current.getTime() <= end.getTime()) {
            if (occursOnLocalDate(task.repeat, current)) {
                const occurrenceKey = Utility.getDateKey(current)
                for (const step of task.steps) {
                    const completed = step.completions.some(completion => completion.date === occurrenceKey)
                    if (completed) continue
                    result.push({
                        occurs: "repeating",
                        taskId: task.id,
                        stepId: step.id,
                        duration: step.duration,
                        date: occurrenceKey
                    })
                }
            }
            current.setDate(current.getDate() + 1)
        }
    }
    return result
}

const getDateEventOccupancy = (events: Event[], date: Date): number => {
    const dateEvents = Events.getDateEvents(events, date)
    const totalDuration = dateEvents.reduce((total, event) => total + event.duration, 0)
    return totalDuration
}

const getDateCompletedTaskOccupancy = (tasks: Task[], date: Date): number => {
    const dateKey = Utility.getDateKey(date)
    let total = 0
    for (const task of tasks) {
        // Once tasks
        if (task.occurs === "once") {
            for (const step of task.steps) {
                if (!step.completed) continue
                const completedDateKey = Utility.getDateKey(new Date(step.completed))
                if (completedDateKey === dateKey) {
                    total += step.duration
                }
            }
        }
        // Repeating tasks
        if (task.occurs === "repeating") {
            for (const step of task.steps) {
                for (const completion of step.completions) {
                    if (completion.date === dateKey) { //??
                        total += step.duration
                    }
                }
            }
        }
    }
    return total
}

const getDateCompletedTasks = (tasks: Task[], date: Date): Task[] => {
    const dateKey = Utility.getDateKey(date)
    const completedMap: Record<number, Task> = {}
    for (const task of tasks) {
        if (task.occurs === "once") {
            for (const step of task.steps) {
                if (!step.completed) continue
                const completedDateKey = Utility.getDateKey(new Date(step.completed))
                if (completedDateKey === dateKey) {
                    if (!completedMap[task.id]) completedMap[task.id] = { // add task if it doesn't already exist
                        ...task,
                        steps: []
                    }
                    completedMap[step.id].steps.push(step as never)
                    continue
                }
            }
        }
        if (task.occurs === "repeating") {
            for (const step of task.steps) {
                for (const completion of step.completions) {
                    const completedDateKey = Utility.getDateKey(new Date(completion.completed))
                        if (completedDateKey === dateKey) {
                            if (!completedMap[task.id]) completedMap[task.id] = { // add task if it doesn't already exist
                            ...task,
                            steps: []
                        }
                        completedMap[step.id].steps.push(step as never)
                        continue
                    }
                }
            }
        }
    }
    return Object.values(completedMap)
}