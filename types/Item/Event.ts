import { Repeat } from "./Repeat"
import { BaseItem } from "."

type BaseEvent = BaseItem & {
    type: "event",
    notes?: string,
    duration: number // minutes
}

export type OnceEvent = BaseEvent & {
    occurs: "once",
    starts: string // ISO 8601 datetime,
}

export type RepeatingEvent = BaseEvent & {
    occurs: "repeating",
    starts: string, // ISO 8601 datetime
    repeat: Repeat
}

export type Event = OnceEvent | RepeatingEvent