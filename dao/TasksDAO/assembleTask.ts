import { Prisma } from "@/lib/prisma"
import assembleSimpleUser from "../UsersDAO/assembleSimpleUser"
import tasksBaseQuery from "./tasksBaseQuery"
import Task, { OnceTask, RepeatingTask } from "@/types/Task"
import Repeat from "@/types/Repeat"
import assembleStepCompletion from "./assembleStepCompletion"

type TaskResult = Prisma.tasksGetPayload<typeof tasksBaseQuery>

const assembleOnceTask = (result: TaskResult): OnceTask => {
    return {
        type: "task",
        occurs: "once",
        id: result.id,
        user: assembleSimpleUser(result.user),
        name: result.name,
        description: result.description,
        steps: result.steps.map(step => ({
            id: step.id,
            name: step.name,
            notes: step.notes ? step.notes : undefined,
            duration: step.duration,
            completed: step.completed ? step.completed.toISOString() : undefined
        })),
        importance: result.importance,
        deadline: result.once_deadline ? result.once_deadline : undefined,
        created: result.created.toISOString(),
        updated: result.updated.toISOString()
    }
}

const assembleRepeatingTask = (result: TaskResult): RepeatingTask => {
    return {
        type: "task",
        occurs: "repeating",
        id: result.id,
        user: assembleSimpleUser(result.user),
        name: result.name,
        description: result.description,
        steps: result.steps.map(step => ({
            id: step.id,
            name: step.name,
            notes: step.notes ? step.notes : undefined,
            duration: step.duration,
            completions: step.completions.map(completion => assembleStepCompletion(completion))
        })),
        importance: result.importance,
        deadline: result.repeating_deadline ? result.repeating_deadline : undefined,
        repeat: result.repeat as Repeat,
        created: result.created.toISOString(),
        updated: result.updated.toISOString()
    }
}

const assembleTask = (result: TaskResult): Task => {
    return result.occurs === "once" ? assembleOnceTask(result)
        : assembleRepeatingTask(result)
}

export default assembleTask