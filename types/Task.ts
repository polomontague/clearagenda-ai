import SimpleUser from "./SimpleUser"
import Repeat from "./Repeat"

export type Clarity = "low" | "medium" | "high"
export type Friction = "starting" | "steps" | "learning" | "scope" | "approach" | "duration"
export type Specification = string

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
    clarity: Clarity,
    friction: Friction[],
    specifications: Specification[],
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

export type Completion = {
    id: number,
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

export type StepOccurrence = Pick<Step, "id" | "name" | "notes" | "duration"> & {
    completed?: string
}

export type TaskOccurrence = {
    task: Task,
    date_available: string,
    steps: StepOccurrence[],
    completion: number,
    effective_deadline?: string
}

export default Task