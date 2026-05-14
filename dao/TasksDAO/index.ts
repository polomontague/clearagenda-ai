import prisma from "@/lib/prisma"
import { OnceTask, OnceStep, RepeatingTask, RepeatingStep } from "@/types/Task"
import tasksBaseQuery from "./tasksBaseQuery"
import assembleTask from "./assembleTask"

type BaseOnceTaskData = Pick<OnceTask, "name" | "description" | "importance" | "deadline"> & {
    occurs: "once",
    steps: Pick<OnceStep, "name" | "notes" | "duration">[]
}

type BaseRepeatingTaskData = Pick<RepeatingTask, "name" | "description" | "importance" | "deadline" | "repeat"> & {
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

const TasksDAO = {
    createTask: async (data: CreateTaskData) => {
        const result = await prisma.tasks.create({
            data: {
                occurs: data.occurs,
                user_id: data.user_id,
                name: data.name,
                description: data.description,
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
    deleteTask: async (taskId: number) => {
        const result = await prisma.tasks.delete({
            where: {
                id: taskId
            },
            ...tasksBaseQuery
        })
        return assembleTask(result)
    }
}

export default TasksDAO