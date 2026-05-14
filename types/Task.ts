import SimpleUser from "./SimpleUser"
import Repeat from "./Repeat"

type BaseStep = {
    id: number,
    name: string,
    notes?: string,
    duration: number
}

type BaseTask = {
    type: "task",
    id: number,
    user: SimpleUser,
    name: string,
    description: string,
    importance: number,
    created: string,
    updated: string
}

export type OnceStep = BaseStep & {
    completed?: string
}

export type OnceTask = BaseTask & {
    occurs: "once",
    steps: OnceStep[],
    deadline?: string
}

type Completion = {
    date: string,
    completed: string
}

export type RepeatingStep = BaseStep & {
    completions: Completion[]
}

export type RepeatingTask = BaseTask & {
    occurs: "repeating",
    steps: RepeatingStep[],
    deadline?: number,
    repeat: Repeat
}

export type Step = OnceStep | RepeatingStep

type Task = OnceTask | RepeatingTask

export default Task