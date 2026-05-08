import prisma from "@/lib/prisma"
import { OnceTask, OnceStep, RepeatingTask, RepeatingStep } from "@/types/Task"

type BaseOnceTaskData = Pick<OnceTask, "name" | "description" | "importance" | "deadline"> & {
    occurs: "once",
    steps: Pick<OnceStep, "name" | "notes" | "duration">[]
}

type BaseRepeatingTaskData = Pick<RepeatingTask, "name" | "description" | "importance" | "repeat"> & {
    occurs: "repeating",
    steps: Pick<RepeatingStep, "">[]
}

type CreateTaskData = BaseTaskData & {
    user_id: number
}

const TasksDAO = {
    createTask: (data: CreateTaskData) => {

    }
}

export default TasksDAO