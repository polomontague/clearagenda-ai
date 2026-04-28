import { BaseItem } from "."
import { Repeat } from "./Repeat"

export type Step = {
    id: number,
    name: string,
    notes?: string,
    duration: number, // minutes
    completed?: string // ISO 8601 datetime
}

type BaseTask = BaseItem & {
    type: "task",
    description: string,
    steps: Step[]
    importance: number, // 0.00-1.00
}

export type OnceTask = BaseTask & {
    occurs: "once"
    deadline?: string // ISO 8601 datetime
}

export type RepeatingTask = BaseTask & {
    occurs: "repeating",
    repeat: Repeat,
}

export type Task = OnceTask | RepeatingTask