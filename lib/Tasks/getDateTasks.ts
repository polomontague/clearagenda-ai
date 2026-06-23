import Task, { TaskOccurrence } from "@/types/Task"
import Event from "@/types/Event"
import User from "@/types/User"
import Utility from "@/lib/Utility"
import getWeekdayCapacity from "./getWeekdayCapacity"
import { getDateEventOccupancy } from "./getEventOccupancy"
import { getDateCompletedTaskOccupancy } from "./getDateCompletedTaskOccupancy"
import { getDeadlineDateKey } from "./getDeadlineDateKey"
import { getTaskInstancesUntilDate } from "./getTaskInstancesUntilDate"
import { getIncompleteStepInstances, StepInstance } from "./getIncompleteStepInstances"
import { getDateCompletedStepInstances } from "./getDateCompletedStepInstances"
import { getTaskInstanceCompletion } from "./getTaskInstanceCompletion"

export default function getDateTasks(tasks: Task[], events: Event[], user: User, date: Date): TaskOccurrence[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = new Date(date)
    target.setHours(0, 0, 0, 0)
    const taskInstances = getTaskInstancesUntilDate(tasks, date)
    taskInstances.sort((a, b) => b.priority - a.priority) // Sort task occurrences by priority score
    const stepInstances = getIncompleteStepInstances(taskInstances)
    /// STILL IN CORRECT ORDER HERE!!!
    const queue = [ ...stepInstances ] // Remaining unscheduled steps queue
    const scheduledStepsByDate: Record<string, StepInstance[]> = {}
    // Step through days from today to target date
    const current = new Date(today)
    while (current.getTime() <= target.getTime()) {
        const dateKey = Utility.getDateKey(current)
        const capacity = getWeekdayCapacity(user, current)
        const eventOccupancy = getDateEventOccupancy(events, current)
        const completedStepOccupancy = getDateCompletedTaskOccupancy(tasks, current)
        const scheduledOccupancy = (scheduledStepsByDate[dateKey] ?? []).reduce((total, stepInstance) => total + stepInstance.step.duration, 0)
        const used = eventOccupancy + completedStepOccupancy + scheduledOccupancy
        let remaining = capacity - used
        if (!scheduledStepsByDate[dateKey]) scheduledStepsByDate[dateKey] = [] // Add date if it doesn't already exist
        const blockedOccurrences = new Set<string>()
        for (const stepInstance of queue) {
            const occurrenceKey = `${stepInstance.task.id}:${stepInstance.dateAvailable}`
            if (blockedOccurrences.has(occurrenceKey)) continue
            const alreadyScheduled = Object.values(scheduledStepsByDate).flat().some(
                s => s.task.id === stepInstance.task.id &&
                    s.step.id === stepInstance.step.id &&
                    s.dateAvailable === stepInstance.dateAvailable
            )
            if (alreadyScheduled) continue
            if (stepInstance.dateAvailable > dateKey) continue // Repeating task step hasn't occured yet
            if (stepInstance.step.duration > remaining) { // Step doesn't fit in current day
                blockedOccurrences.add(occurrenceKey)
                continue
            }
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
    const taskMap = new Map<string, TaskOccurrence>()
    for (const instance of dayStepInstances) {
        const task = instance.task
        const step = task.steps.find(step => step.id === instance.step.id)
        if (!step) continue
        // Add task to map if it doesn't already exist
        const completion = getTaskInstanceCompletion(task, instance.dateAvailable)
        const key = `${task.id}:${instance.dateAvailable}`
        const effectiveDeadline = getDeadlineDateKey(instance)
        if (!taskMap.has(key)) taskMap.set(key, {
            task,
            date_available: instance.dateAvailable,
            steps: [],
            completion,
            effective_deadline: effectiveDeadline
        })
        const scheduledTask = taskMap.get(key)!
        let completed = undefined
        if ("completed" in step) completed = step.completed
        if ("completions" in step) {
            const completion = step.completions.find(completion => completion.date === instance.dateAvailable)
            if (completion) completed = completion.completed
        }
        scheduledTask.steps.push({
            id: step.id,
            name: step.name,
            notes: step.notes,
            duration: step.duration,
            completed
        })
    }
    return Array.from(taskMap.values())
}