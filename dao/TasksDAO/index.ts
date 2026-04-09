import prisma from "@/lib/prisma"
import assembleTask from "./assembleTask"
import taskBaseQuery from "./taskBaseQuery"
import { SimpleTask, ComplexTask } from "@/types/Task"

type SimpleTaskData = Pick<SimpleTask, "name" | "notes" | "duration" | "deadline" | "importance">

type ComplexTaskData = Pick<ComplexTask, "name" | "description" | "deadline" | "importance"> & {
    steps: Pick<ComplexTask["steps"][0], "name" | "notes" | "duration">[]
}

type UpdateTaskData = SimpleTaskData | ComplexTaskData

type CreateTaskData = UpdateTaskData & {
    user_id: number
}

type GetTasksOptions = {
    user_id?: number
}

const TasksDAO = {
    createTask: async (data: CreateTaskData) => {
        const result = await prisma.tasks.create({
            data: {
                user_id: data.user_id,
                name: data.name,
                notes: "notes" in data ? data.notes : null,
                description: "description" in data ? data.description : null,
                duration: "duration" in data ? data.duration : null,
                deadline: data.deadline ? new Date(data.deadline) : null,
                importance: data.importance,
                steps: "steps" in data ? {
                    create: data.steps.map(step => ({
                        name: step.name,
                        notes: step.notes,
                        duration: step.duration
                    }))
                } : undefined
            },
            ...taskBaseQuery
        })
        return assembleTask(result)
    },
    getTasks: async (options: GetTasksOptions) => {
        const result = await prisma.tasks.findMany({
            where: {
                user_id: options.user_id
            },
            ...taskBaseQuery
        })
        return result.map(result => assembleTask(result))
    },
    getTaskById: async (taskId: number) => {
        const result = await prisma.tasks.findUnique({
            where: {
                id: taskId
            },
            ...taskBaseQuery
        })
        if (!result) return
        return assembleTask(result)
    },
    updateTask: async (taskId: number, data: UpdateTaskData) => {
        const result = await prisma.tasks.update({
            where: {
                id: taskId
            },
            data: {
                name: data.name,
                notes: "notes" in data ? data.notes : null,
                description: "description" in data ? data.description : null,
                duration: "duration" in data ? data.duration : null,
                deadline: data.deadline ? new Date(data.deadline) : null,
                importance: data.importance,
                steps: {
                    deleteMany: {},
                    create: "steps" in data ? data.steps.map(step => ({
                        name: step.name,
                        notes: step.notes,
                        duration: step.duration
                    })) : undefined
                }
            },
            ...taskBaseQuery
        })
        if (!result) return
        return assembleTask(result)
    },
    deleteTask: async (taskId: number) => {
        const result = await prisma.tasks.delete({
            where: {
                id: taskId
            },
            ...taskBaseQuery
        })
        if (!result) return
        return assembleTask(result)
    },

    updateTaskCompleted: async (taskId: number, data: Date | undefined) => {
        await prisma.tasks.update({
            where: {
                id: taskId
            },
            data: {
                completed: data
            }
        })
        return data?.toISOString()
    },
    updateStepCompleted: async (stepId: number, data: Date | undefined) => {
        await prisma.task_steps.update({
            where: {
                id: stepId
            },
            data: {
                completed: data
            }
        })
        return data?.toISOString()
    }
}

export default TasksDAO