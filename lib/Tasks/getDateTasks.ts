import Task, { Step, TaskOccurrence } from "@/types/Task"
import Event from "@/types/Event"
import User from "@/types/User"
import Utility from "@/lib/Utility"
import getWeekdayCapacity from "./getWeekdayCapacity"
import Events from "../Events"
import occursOnLocalDate from "./occursOnLocalDate"

type StepInstance = {
    task: Task,
    step: Step,
    dateAvailable: string
}

export default function getDateTasks(tasks: Task[], events: Event[], user: User, date: Date): TaskOccurrence[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = new Date(date)
    target.setHours(0, 0, 0, 0)
    const stepInstances = getIncompleteStepInstancesUntilDate(tasks, date)
    stepInstances.sort((a, b) => getPriority(b) - getPriority(a))
    const queue = [ ...stepInstances ] // Remaining unscheduled steps queue
    const scheduledStepsByDate: Record<string, StepInstance[]> = {}
    // Step through days from today to target date
    const current = new Date(today)
    while (current.getTime() <= target.getTime()) {
        const dateKey = Utility.getDateKey(current)
        const capacity = getWeekdayCapacity(user, current)
        const eventOccupancy = getDateEventOccupancy(events, current)
        const completedTaskOccupancy = getDateCompletedTaskOccupancy(tasks, current)
        const scheduledOccupancy = (scheduledStepsByDate[dateKey] ?? []).reduce((total, stepInstance) => total + stepInstance.step.duration, 0)
        const used = eventOccupancy + completedTaskOccupancy + scheduledOccupancy
        let remaining = capacity - used
        if (!scheduledStepsByDate[dateKey]) scheduledStepsByDate[dateKey] = [] // Add date if it doesn't already exist
        for (const stepInstance of queue) {
            const alreadyScheduled = Object.values(scheduledStepsByDate).flat().some(
                s => s.task.id === stepInstance.task.id &&
                    s.step.id === stepInstance.step.id &&
                    s.dateAvailable === stepInstance.dateAvailable
            )
            if (alreadyScheduled) continue
            if (stepInstance.dateAvailable > dateKey) continue // Repeating task step hasn't occured yet
            if (stepInstance.step.duration > remaining) continue // Step doesn't fit in current day
            scheduledStepsByDate[dateKey].push(stepInstance) // Schedule the step
            remaining -= stepInstance.step.duration
        }
        current.setDate(current.getDate() + 1)
    }
    // Get steps completed on requested date
    const completedStepInstances = getDateCompletedStepInstances(tasks, date)
    const scheduledStepInstances = scheduledStepsByDate[Utility.getDateKey(target)] ?? []
    const dayStepInstances = [ ...completedStepInstances, ...scheduledStepInstances ]
    // Group scheduled StepInstances into TaskOccurrences
    const taskMap = new Map<number, TaskOccurrence>()
    for (const instance of dayStepInstances) {
        const task = instance.task
        const step = task.steps.find(step => step.id === instance.step.id)
        if (!step) continue
        // Add task to map if it doesn't already exist
        const completion = getCompletion(instance)
        if (!taskMap.has(task.id)) taskMap.set(task.id, {
            id: task.id,
            occurs: task.occurs,
            user: task.user,
            date: instance.dateAvailable,
            name: task.name,
            description: task.description,
            steps: [],
            importance: task.importance,
            completion,
            deadline: getDeadline(instance),
            created: task.created,
            updated: task.updated
        })
        const scheduledTask = taskMap.get(task.id)!
        scheduledTask.steps.push(step as never)
    }
    return Array.from(taskMap.values())
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
                    task,
                    step,
                    dateAvailable: startKey
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
                        task,
                        step,
                        dateAvailable: occurrenceKey
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
    const totalDuration = dateEvents.reduce((total, occurrence) => total + occurrence.event.duration, 0)
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
                    if (completion.date === dateKey) { // ??
                        total += step.duration
                    }
                }
            }
        }
    }
    return total
}

const getDateCompletedStepInstances = (tasks: Task[], date: Date): StepInstance[] => {
    const instances: StepInstance[] = []
    const dateKey = Utility.getDateKey(date)
    const today = new Date()
    const todayDateKey = Utility.getDateKey(today)
    for (const task of tasks) {
        if (task.occurs === "once") {
            for (const step of task.steps) {
                if (!step.completed) continue
                const completedDateKey = Utility.getDateKey(new Date(step.completed))
                if (completedDateKey !== dateKey) continue
                instances.push({
                    task,
                    step,
                    dateAvailable: todayDateKey
                })
                continue
            }
        }
        if (task.occurs === "repeating") {
            for (const step of task.steps) {
                for (const completion of step.completions) {
                    const occurrenceDateKey = Utility.getDateKey(Utility.loadLocalDate(completion.date))
                    const completedDateKey = Utility.getDateKey(new Date(completion.completed))
                    if (completedDateKey !== dateKey) continue
                    instances.push({
                        task,
                        step,
                        dateAvailable: occurrenceDateKey
                    })
                }
            }
        }
    }
    return instances
}

const getPriority = (instance: StepInstance): number => {
    let score = 0
    // Urgency Pressure Score
    const pressure = getUrgencyPressure(instance)
    score += pressure
    // Importance
    score *= (1 + instance.task.importance * 0.5)
    // Partially Complete
    const completion = getCompletion(instance)
    if (completion > 0) {
        score *= (1 + completion * 0.1)
    }
    // Short Tasks - bump up
    const incompleteDuration = getIncompleteDuration(instance)
    const shortTaskBoost = 1 / (1 + incompleteDuration / 30)
    score *= (1 + shortTaskBoost * 0.15)
    return score
}

const getUrgencyPressure = (instance: StepInstance): number => {
    if (!instance.task.deadline) return 0
    let effectiveDeadline
    if (instance.task.occurs === "once") {
        effectiveDeadline = Utility.loadLocalDate(instance.task.deadline)
        effectiveDeadline.setDate(effectiveDeadline.getDate() + 1)
        effectiveDeadline.setHours(0, 0, 0, 0)
    } else { // Repeating
        effectiveDeadline = Utility.loadLocalDate(instance.dateAvailable)
        effectiveDeadline.setDate(effectiveDeadline.getDate() + 1)
        effectiveDeadline.setHours(0, 0, 0, 0)
        effectiveDeadline.setDate(effectiveDeadline.getDate() + instance.task.deadline) // Add deadline days
    }
    const incompleteDuration = getIncompleteDuration(instance)
    effectiveDeadline.setMinutes(effectiveDeadline.getMinutes() - incompleteDuration)
    const now = new Date()
    const timeRemaining = effectiveDeadline.getTime() - now.getTime()
    const daysRemaining = timeRemaining / (1000 * 60 * 60 * 24)
    let pressure = 0
    if (daysRemaining <= 0) {
        pressure = 1 + Math.abs(daysRemaining) * 2
    } else {
        pressure = 1 / (daysRemaining + 1)
    }
    return pressure
}

const getIncompleteDuration = (instance: StepInstance): number => {
    if (instance.task.occurs === "once") {
        return instance.task.steps.reduce((total, step) => {
            return total + (step.completed ? 0 : step.duration)
        }, 0)
    } else { // Repeating
        return instance.task.steps.reduce((total, step) => {
            const completion = step.completions.find(completion => completion.date === instance.dateAvailable)
            return total + (completion ? 0 : step.duration)
        }, 0)
    }
}

const getCompletion = (instance: StepInstance): number => {
    const totalDuration = instance.task.steps.reduce((total, step) => {
        return total + step.duration
    }, 0)
    const completedDuration = instance.task.occurs === "once" ? (
        instance.task.steps.reduce((total, step) => {
            return total + (step.completed ? step.duration : 0)
        }, 0)
    ) :  instance.task.steps.reduce((total, step) => {
        const completion = step.completions.find(completion => completion.date === instance.dateAvailable)
        return total + (completion ? step.duration : 0)
    }, 0)
    return Math.round((completedDuration / totalDuration) * 100) / 100
}

const getDeadline = (instance: StepInstance): string | undefined => {
    if (!instance.task.deadline) return undefined
    let deadline
    if (instance.task.occurs === "once") {
        deadline = Utility.loadLocalDate(instance.task.deadline)
    } else { // Repeating
        deadline = Utility.loadLocalDate(instance.dateAvailable)
        deadline.setHours(0, 0, 0, 0) // just to be safe about DST shifts
        deadline.setDate(deadline.getDate() + instance.task.deadline)
    }
    return Utility.getDateKey(deadline)
}