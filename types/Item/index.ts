import SimpleUser from "@/types/SimpleUser"
import { Task, OnceTask, RepeatingTask } from "./Task"
import { Event, OnceEvent, RepeatingEvent } from "./Event"

export type BaseItem = {
    id: number,
    user: SimpleUser,
    name: string,
    created: string, // ISO 8601 datetime
    updated: string // ISO 8601 datetime
}

type Item = Task | Event

export type OnceItem = OnceTask | OnceEvent
export type RepeatingItem = RepeatingTask | RepeatingEvent

export type { Repeat } from "./Repeat"
export type { Task, Step, OnceTask, RepeatingTask } from "./Task"
export type { Event, OnceEvent, RepeatingEvent } from "./Event"
export default Item