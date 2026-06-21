import prisma from "@/lib/prisma"
import { OnceTask, OnceStep, RepeatingTask, RepeatingStep } from "@/types/Task"
import tasksBaseQuery from "./tasksBaseQuery"
import assembleTask from "./assembleTask"
import stepCompletionsBaseQuery from "./stepCompletionsBaseQuery"
import assembleStepCompletion from "./assembleStepCompletion"

type BaseOnceTaskData = Pick<OnceTask, "name" | "description" | "clarity" | "friction" | "specifications" | "importance" | "deadline"> & {
    occurs: "once",
    steps: Pick<OnceStep, "name" | "notes" | "duration">[]
}

type BaseRepeatingTaskData = Pick<RepeatingTask, "name" | "description" | "clarity" | "friction" | "specifications" | "importance" | "deadline" | "repeat"> & {
    occurs: "repeating",
    steps: Pick<RepeatingStep, "name" | "notes" | "duration">[]
}

type BaseTaskData = BaseOnceTaskData | BaseRepeatingTaskData

type CreateTaskData = BaseTaskData & {
    user_id: number
}

type UpdateTaskData = BaseTaskData

type GetTasksOptions = {
    user_id?: number
}

type CompletedData = string | undefined

type CompletionData = {
    date: string,
    completed: string
}

const TasksDAO = {
    createTask: async (data: CreateTaskData) => {
        const result = await prisma.tasks.create({
            data: {
                occurs: data.occurs,
                user_id: data.user_id,
                name: data.name,
                description: data.description,
                clarity: data.clarity,
                friction: data.friction,
                specifications: data.specifications,
                steps: {
                    create: data.steps.map(step => ({
                        name: step.name,
                        notes: step.notes,
                        duration: step.duration
                    }))
                },
                importance: data.importance,
                once_deadline: data.occurs === "once" ? data.deadline : undefined,
                repeating_deadline: data.occurs === "repeating" ? data.deadline : undefined,
                repeat: "repeat" in data ? data.repeat : undefined,
            },
            ...tasksBaseQuery
        })
        return assembleTask(result)
    },
    getTasks: async (options: GetTasksOptions) => {
        const result = await prisma.tasks.findMany({
            where: {
                user_id: options.user_id
            },
            ...tasksBaseQuery
        })
        return result.map(result => assembleTask(result))
    },
    getTaskById: async (taskId: number) => {
        const result = await prisma.tasks.findUnique({
            where: {
                id: taskId
            },
            ...tasksBaseQuery
        })
        return result ? assembleTask(result) : undefined
    },
    deleteTask: async (taskId: number) => {
        const result = await prisma.tasks.delete({
            where: {
                id: taskId
            },
            ...tasksBaseQuery
        })
        return assembleTask(result)
    },
    updateStepCompleted: async (stepId: number, data: CompletedData) => {
        const result = await prisma.task_steps.update({
            where: {
                id: stepId
            },
            data: {
                completed: data
            }
        })
        return result.completed ? result.completed.toISOString() : undefined
    },
    createStepCompletion: async (stepId: number, data: CompletionData) => {
        const result = await prisma.task_step_completions.create({
            data: {
                step_id: stepId,
                date: data.date,
                completed: data.completed
            },
            ...stepCompletionsBaseQuery
        })
        return assembleStepCompletion(result)
    },
    deleteStepCompletion: async (completionId: number) => {
        const result = await prisma.task_step_completions.delete({
            where: {
                id: completionId
            },
            ...stepCompletionsBaseQuery
        })
        return assembleStepCompletion(result)
    }
}

export default TasksDAO