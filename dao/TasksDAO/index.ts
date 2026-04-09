import prisma from "@/lib/prisma"
import assembleTask from "./assembleTask"
import taskBaseQuery from "./taskBaseQuery"
import { SimpleTask, ComplexTask } from "@/types/Task"

type SimpleTaskData = Pick<SimpleTask, "name" | "notes" | "duration" | "deadline" | "importance">

type ComplexTaskData = Pick<ComplexTask, "name" | "description" | "deadline" | "importance"> & {
    steps: Pick<ComplexTask["steps"][0], "name" | "notes" | "duration">[]
}

type TaskData = SimpleTaskData | ComplexTaskData

const TasksDAO = {
    createTask: async (data: TaskData) => {
        const result = await prisma.tasks.create({
            data: {
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
    getTasks: async () => {
        const result = await prisma.tasks.findMany({
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
    updateTask: async (taskId: number, data: TaskData) => {
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
    }
}

export default TasksDAO